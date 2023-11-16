import { db } from '../../db';
import { batch } from '../helper/batch';
import { fetchApi } from '../helper/fetchApi';
import { createEntityMap } from '../helper/map';
import { toId } from '../helper/toId';
import { Job } from '../job';
import { Language, PrismaClient, Revision } from '@gw2treasures/database';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadColors } from '../helper/loadColors';
import { LocalizedObject } from '../helper/types';
import { JobName } from '..';
import { isEmptyObject } from '../helper/is';

interface ColorsJobProps extends ProcessEntitiesData<number> {}

export const ColorsJob: Job = {
  run(data: ColorsJobProps | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'colors',
        () => fetchApi<number[]>('/v2/colors'),
        db.color.findMany
      );
    }

    return processLocalizedEntities(
      data,
      'Color',
      (colorId, revisionId) => ({ colorId_revisionId: { revisionId, colorId }}),
      (colors) => ({ name_de: colors.de.name, name_en: colors.en.name, name_es: colors.es.name, name_fr: colors.fr.name }),
      db.color.findMany,
      loadColors,
      (tx, data) => tx.color.upsert(data),
    );
  }
};

type FindManyArgs = {
  select: { id: true },
  where: {
    removedFromApi: false,
    id?: { notIn: number[] },
    lastCheckedAt?: { lt: Date }
  }
}

async function createSubJobs(
  jobName: JobName,
  getIdsFromApi: () => Promise<number[]>,
  findMany: (args: FindManyArgs) => Promise<{ id: number }[]>
) {
  const queuedJobs = await db.job.count({ where: { type: jobName, state: { in: ['Queued', 'Running'] }, cron: null }});

  if(queuedJobs > 0) {
    return 'Waiting for pending follow up jobs';
  }

  const build = await getCurrentBuild();

  // get known ids
  const knownIds = (await findMany({
    where: { removedFromApi: false },
    select: { id: true },
  })).map(toId);

  // get ids currently in the api
  const apiIds = await getIdsFromApi();

  // get new or rediscovered ids
  const newOrRediscoveredIds = apiIds.filter((id) => !knownIds.includes(id));

  // also load all ids where the lastCheckedAt is before the build.createdAt
  // these ids were not checked on the current build and thus should be queued
  const knownIdsLastUpdatedOnOldBuild = (await findMany({
    where: { lastCheckedAt: { lt: build.createdAt }, removedFromApi: false, id: { notIn: newOrRediscoveredIds }},
    select: { id: true }
  })).map(toId);

  // some stats
  let jobCount = 0;
  let idCount = 0;

  // create new/rediscover/update jobs
  for(const ids of batch([...newOrRediscoveredIds, ...knownIdsLastUpdatedOnOldBuild], 200)) {
    await db.job.create({ data: { type: jobName, data: { ids }}});
    jobCount++;
    idCount += ids.length;
  }

  // build list of ids that are no longer available in the api
  const removedIds = knownIds.filter((id) => !apiIds.includes(id));

  // create remove jobs
  // these are separate because we can skip the api request, they have no other special casing
  for(const ids of batch(removedIds, 200)) {
    await db.job.create({ data: { type: jobName, data: { ids, removed: true }}});
    jobCount++;
    idCount += ids.length;
  }

  // output
  return `Queued ${jobCount} jobs for ${idCount} entries`;
}

interface ProcessEntitiesData<Id extends string | number> {
  ids: Id[];
  removed?: boolean;
}

type GetEntitiesArgs<Id> = {
  where: { id: { in: Id[] }},
  include: { current_de: true, current_en: true, current_es: true, current_fr: true },
};

type DbEntityBase<Id extends string | number> = {
  id: Id,
  current_de: Revision,
  current_en: Revision,
  current_es: Revision,
  current_fr: Revision,
  removedFromApi: boolean,
}

type UpsertInput<Id, HistoryId, ExtraData> = {
  where: { id: Id },
  create: UpsertInputData<Id, HistoryId> & ExtraData,
  update: UpsertInputData<Id, HistoryId> & Partial<ExtraData>,
}

type UpsertInputData<Id, HistoryId> = {
  id: Id,
  currentId_de: string,
  currentId_en: string,
  currentId_es: string,
  currentId_fr: string,

  history: {
    connectOrCreate: [
      { where: HistoryId, create: { revisionId: string }},
      { where: HistoryId, create: { revisionId: string }},
      { where: HistoryId, create: { revisionId: string }},
      { where: HistoryId, create: { revisionId: string }},
    ]
  },

  lastCheckedAt: Date,
  removedFromApi: boolean,
};

async function processLocalizedEntities<Id extends string | number, DbEntity extends DbEntityBase<Id>, ApiEntity extends { id: Id }, HistoryId, ExtraData>(
  data: ProcessEntitiesData<Id>,
  entityName: string,
  createHistoryId: (id: Id, revisionId: string) => HistoryId,
  migrate: (entity: LocalizedObject<ApiEntity>) => ExtraData | Promise<ExtraData>,
  getEntitiesFromDb: (args: GetEntitiesArgs<Id>) => Promise<DbEntity[]>,
  getEntitiesFromApi: (ids: Id[]) => Promise<Map<Id, LocalizedObject<ApiEntity>>>,
  upsert: (tx: PrismaTransaction, data: UpsertInput<Id, HistoryId, ExtraData>) => Promise<unknown>,
) {
  // get the current build
  const build = await getCurrentBuild();
  const buildId = build.id;

  // load the current ids from the db
  const dbEntities = await createEntityMap(getEntitiesFromDb({
    where: { id: { in: data.ids }},
    include: { current_de: true, current_en: true, current_es: true, current_fr: true }
  }));

  // fetch latest from api
  // if we are currently handling removed ids we can skip the api call
  const apiEntities = data.removed ? undefined : await getEntitiesFromApi(data.ids);

  let processedEntityCount = 0;

  // iterate over all ids
  for(const id of data.ids) {
    await db.$transaction(async (tx) => {
      // get the db and api entry
      const dbEntity = dbEntities.get(id);
      const apiData = apiEntities?.get(id);

      // parse known data
      const dbData: undefined | LocalizedObject<ApiEntity> = dbEntity ? {
        de: JSON.parse(dbEntity.current_de.data),
        en: JSON.parse(dbEntity.current_en.data),
        es: JSON.parse(dbEntity.current_es.data),
        fr: JSON.parse(dbEntity.current_fr.data),
      } : undefined;

      // create revisions
      const [revision_de, revision_en, revision_es, revision_fr] = await Promise.all([
        (await createRevision(tx, dbData?.de, apiData?.de, dbEntity?.removedFromApi, { buildId, entity: entityName, language: 'de' })) ?? dbEntity!.current_de,
        (await createRevision(tx, dbData?.en, apiData?.en, dbEntity?.removedFromApi, { buildId, entity: entityName, language: 'en' })) ?? dbEntity!.current_en,
        (await createRevision(tx, dbData?.es, apiData?.es, dbEntity?.removedFromApi, { buildId, entity: entityName, language: 'es' })) ?? dbEntity!.current_es,
        (await createRevision(tx, dbData?.fr, apiData?.fr, dbEntity?.removedFromApi, { buildId, entity: entityName, language: 'fr' })) ?? dbEntity!.current_fr,
      ]);

      // check if nothing changed
      const revisionsChanged = !dbEntity || revision_de !== dbEntity.current_de || revision_en !== dbEntity.current_en || revision_es !== dbEntity.current_es || revision_fr !== dbEntity.current_fr;
      if(!revisionsChanged) {
        return;
      }

      const data: UpsertInputData<Id, HistoryId> & ExtraData = {
        id,

        ...await migrate(apiData ?? dbData!),

        currentId_de: revision_de.id,
        currentId_en: revision_en.id,
        currentId_es: revision_es.id,
        currentId_fr: revision_fr.id,

        history: {
          connectOrCreate: [
            { where: createHistoryId(id, revision_de.id), create: { revisionId: revision_de.id }},
            { where: createHistoryId(id, revision_en.id), create: { revisionId: revision_en.id }},
            { where: createHistoryId(id, revision_es.id), create: { revisionId: revision_es.id }},
            { where: createHistoryId(id, revision_fr.id), create: { revisionId: revision_fr.id }},
          ]
        },

        lastCheckedAt: new Date(),
        removedFromApi: !!apiData,
      };

      // update in db
      await upsert(tx, {
        where: { id },
        create: data,
        update: data
      });

      processedEntityCount++;
    });
  }

  return `Updated ${processedEntityCount}/${data.ids.length}`;
}

type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

function createRevision<T>(tx: PrismaTransaction, known: T | undefined, updated: T | undefined, wasRemoved: boolean | undefined, base: { buildId: number, entity: string, language: Language }) {
  // convert data to json
  const knownData = JSON.stringify(known);
  const updatedData = JSON.stringify(updated);

  // new
  if(!knownData) {
    return tx.revision.create({ data: { ...base, data: updatedData, type: 'Added', description: 'Added to API' }});
  }

  // removed
  if(!updatedData) {
    return tx.revision.create({ data: { ...base, data: knownData, type: 'Removed', description: 'Removed from API' }});
  }

  // rediscovered
  if(wasRemoved) {
    return tx.revision.create({ data: { ...base, data: updatedData, type: 'Update', description: 'Rediscoverd in API' }});
  }

  // updated
  if(knownData !== updatedData) {
    return tx.revision.create({ data: { ...base, data: updatedData, type: 'Update', description: 'Updated in API' }});
  }

  // nothing has changed, so we don't need to create a new revision
  return undefined;
}
