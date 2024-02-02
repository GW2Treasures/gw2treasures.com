import { Language, Revision } from '@gw2treasures/database';
import { JobName } from '..';
import { PrismaTransaction, db } from '../../db';
import { batch } from './batch';
import { getCurrentBuild } from './getCurrentBuild';
import { toId } from './toId';
import { LocalizedObject } from './types';
import { createEntityMap } from './map';
import { createRevision as createRevisionInDb } from './revision-create';
import { getUpdateCheckpoint } from './updateCheckpoints';

type FindManyArgs = {
  select: { id: true },
  where: {
    removedFromApi?: false,
    id?: { notIn: number[] },
    lastCheckedAt?: { lt: Date },
    version?: { lt: number },
  }
}

export async function createSubJobs(
  jobName: JobName,
  getIdsFromApi: () => Promise<number[]>,
  findMany: (args: FindManyArgs) => Promise<{ id: number }[]>,
  currentVersion: number,
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

  // also load all ids where the lastCheckedAt is before the builds checkpoint
  // these ids were not checked on the current build and thus should be queued
  const checkpoint = getUpdateCheckpoint(build.createdAt);
  const knownIdsLastUpdatedOnOldBuild = checkpoint
    ? (await findMany({
        where: { lastCheckedAt: { lt: checkpoint }, removedFromApi: false, id: { notIn: newOrRediscoveredIds }},
        select: { id: true }
      })).map(toId)
    : [];

  // and then also include ids that need to be migrated
  const idsToBeMigrated = (await findMany({
    where: { version: { lt: currentVersion }, id: { notIn: [...newOrRediscoveredIds, ...knownIdsLastUpdatedOnOldBuild] }},
    select: { id: true }
  })).map(toId);

  // some stats
  let jobCount = 0;
  let idCount = 0;

  // create new/rediscover/update jobs
  for(const ids of batch([...newOrRediscoveredIds, ...knownIdsLastUpdatedOnOldBuild, ...idsToBeMigrated], 200)) {
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
  return `Queued ${jobCount} jobs for ${idCount} entries (${newOrRediscoveredIds.length} new, ${knownIdsLastUpdatedOnOldBuild.length} updated, ${idsToBeMigrated.length} migrated, ${removedIds.length} removed)`;
}

export interface ProcessEntitiesData<Id extends string | number> {
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
  version: number,
}

type CreateInput<Id, HistoryId, ExtraData> = {
  data: InputData<Id, HistoryId> & ExtraData,
}

type UpdateInput<Id, HistoryId, ExtraData> = {
  where: { id: Id },
  data: Partial<InputData<Id, HistoryId> & ExtraData> | { lastCheckedAt: Date },
}

export type InputData<Id, HistoryId> = {
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
  version: number,
};

export enum Changes {
  New,
  Remove,
  Update,
  Migrate,
  None,
}

export async function processLocalizedEntities<Id extends string | number, DbEntity extends DbEntityBase<Id>, ApiEntity extends { id: Id }, HistoryId, ExtraData>(
  data: ProcessEntitiesData<Id>,
  entityName: string,
  createHistoryId: (id: Id, revisionId: string) => HistoryId,
  migrate: (entity: LocalizedObject<ApiEntity>, version: number, changes: Changes) => ExtraData | Promise<ExtraData>,
  getEntitiesFromDb: (args: GetEntitiesArgs<Id>) => Promise<DbEntity[]>,
  getEntitiesFromApi: (ids: Id[]) => Promise<Map<Id, LocalizedObject<ApiEntity>>>,
  create: (tx: PrismaTransaction, data: CreateInput<Id, HistoryId, ExtraData>) => Promise<unknown>,
  update: (tx: PrismaTransaction, data: UpdateInput<Id, HistoryId, ExtraData>) => Promise<unknown>,
  currentVersion: number,
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

      // check if the db has an old migration version
      const migrationVersionChanged = dbEntity?.version != currentVersion;

      // if nothing changed and we also don't have to migrate anything we can early return
      if(!revisionsChanged && !migrationVersionChanged) {
        await update(tx, { where: { id }, data: { lastCheckedAt: new Date() }});
        return;
      }

      // always run all migrations if a revision changed, otherwise run only required migrations
      const migrationVersion = revisionsChanged ? -1 : dbEntity.version;

      const changes =
        !dbData ? Changes.New :
        !apiData ? Changes.Remove :
        revisionsChanged ? Changes.Update :
        migrationVersionChanged ? Changes.Migrate :
        Changes.None;

      const data: InputData<Id, HistoryId> & ExtraData = {
        id,

        ...await migrate(apiData ?? dbData!, migrationVersion, changes),

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
        removedFromApi: !apiData,
        version: currentVersion,
      };

      // update in db
      if(changes === Changes.New) {
        await create(tx, { data });
      } else {
        await update(tx, { where: { id }, data });
      }

      processedEntityCount++;
    });
  }

  return `Updated ${processedEntityCount}/${data.ids.length}`;
}

function createRevision<T>(tx: PrismaTransaction, known: T | undefined, updated: T | undefined, wasRemoved: boolean | undefined, base: { buildId: number, entity: string, language: Language }) {
  // convert data to json
  const knownData = known !== undefined && JSON.stringify(known);
  const updatedData = updated !== undefined && JSON.stringify(updated);

  // new
  if(!knownData && updatedData) {
    return createRevisionInDb({ ...base, data: updatedData, type: 'Added', description: 'Added to API' }, tx);
  }

  // removed
  if(knownData && !updatedData && !wasRemoved) {
    return createRevisionInDb({ ...base, data: knownData, type: 'Removed', description: 'Removed from API' }, tx);
  }

  // rediscovered
  if(knownData && updatedData && wasRemoved) {
    return createRevisionInDb({ ...base, data: updatedData, type: 'Update', description: 'Rediscoverd in API' }, tx);
  }

  // updated
  if(knownData && updatedData && knownData !== updatedData) {
    return createRevisionInDb({ ...base, data: updatedData, type: 'Update', description: 'Updated in API' }, tx);
  }

  // nothing has changed, so we don't need to create a new revision
  return undefined;
}
