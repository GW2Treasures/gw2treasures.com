import { db } from '../../db';
import { batch } from '../helper/batch';
import { fetchApi } from '../helper/fetchApi';
import { createEntityMap } from '../helper/map';
import { toId } from '../helper/toId';
import { Job } from '../job';
import { Language, Prisma, PrismaClient } from '@gw2treasures/database';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadColors } from '../helper/loadColors';
import { LocalizedObject } from '../helper/types';
import { Gw2Api } from 'gw2-api-types';

interface ColorsJobProps {
  ids: number[];
  removed?: boolean;
}

export const ColorsJob: Job = {
  async run(data: ColorsJobProps | Record<string, never>) {
    // get the current build
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(!data.ids) {
      // const queuedJobs = await db.job.count({ where: { type: { in: ['colors'] }, state: { in: ['Queued', 'Running'] }, cron: null }});
      // if(queuedJobs > 0) {
      //   return 'Waiting for pending follow up jobs';
      // }

      // get known ids
      const knownIds = (await db.color.findMany({
        where: { removedFromApi: false },
        select: { id: true },
      })).map(toId);

      // get ids currently in the api
      const apiIds = await fetchApi<number[]>('/v2/colors');

      // get new or rediscovered ids
      const newOrRediscoveredIds = apiIds.filter((id) => !knownIds.includes(id));

      // also load all ids where the lastCheckedAt is before the build.createdAt
      // these ids were not checked on the current build and thus should be queued
      const knownIdsLastUpdatedOnOldBuild = (await db.color.findMany({
        where: { lastCheckedAt: { lt: build.createdAt }, removedFromApi: false, id: { notIn: newOrRediscoveredIds }},
        select: { id: true }
      })).map(toId);

      // some stats
      let jobCount = 0;
      let idCount = 0;

      // create new/rediscover/update jobs
      for(const ids of batch([...newOrRediscoveredIds, ...knownIdsLastUpdatedOnOldBuild], 200)) {
        await db.job.create({ data: { type: 'colors', data: { ids }}});
        jobCount++;
        idCount += ids.length;
      }

      // build list of ids that are no longer available in the api
      const removedIds = knownIds.filter((id) => !apiIds.includes(id));

      // create remove jobs
      // these are separate because we can skip the api request, they have no other special casing
      for(const ids of batch(removedIds, 200)) {
        await db.job.create({ data: { type: 'colors', data: { ids, removed: true }}});
        jobCount++;
        idCount += ids.length;
      }

      // output
      return `Queued ${jobCount} jobs for ${idCount} colors`;
    }

    // load the current ids from the db
    const knownEntities = await createEntityMap(db.color.findMany({
      where: { id: { in: data.ids }},
      include: { current_de: true, current_en: true, current_es: true, current_fr: true }
    }));

    // fetch latest from api
    // if we are currently handling removed ids we can skip the api call
    const updatedEntities = data.removed ? undefined : await loadColors(data.ids);

    let processedEntityCount = 0;

    // iterate over all ids
    for(const id of data.ids) {
      await db.$transaction(async (tx) => {
        // get the db and api entry
        const known = knownEntities.get(id);
        const updated = updatedEntities?.get(id);

        // parse known data
        const knownData: undefined | LocalizedObject<Gw2Api.Color> = known ? {
          de: JSON.parse(known.current_de.data),
          en: JSON.parse(known.current_en.data),
          es: JSON.parse(known.current_es.data),
          fr: JSON.parse(known.current_fr.data),
        } : undefined;

        // create revisions
        const [revision_de, revision_en, revision_es, revision_fr] = await Promise.all([
          (await createRevision(tx, knownData?.de, updated?.de, known?.removedFromApi, { buildId, entity: 'Color', language: 'de' })) ?? known!.current_de,
          (await createRevision(tx, knownData?.en, updated?.en, known?.removedFromApi, { buildId, entity: 'Color', language: 'en' })) ?? known!.current_en,
          (await createRevision(tx, knownData?.es, updated?.es, known?.removedFromApi, { buildId, entity: 'Color', language: 'es' })) ?? known!.current_es,
          (await createRevision(tx, knownData?.fr, updated?.fr, known?.removedFromApi, { buildId, entity: 'Color', language: 'fr' })) ?? known!.current_fr,
        ]);

        // check if nothing changed
        if(known && revision_de === known.current_de && revision_en === known.current_en && revision_es === known.current_es && revision_fr === known.current_fr) {
          return;
        }

        // TODO: data migration

        const data = {
          id,

          name_de: updated?.de.name ?? known?.name_de ?? '',
          name_en: updated?.en.name ?? known?.name_en ?? '',
          name_es: updated?.es.name ?? known?.name_es ?? '',
          name_fr: updated?.fr.name ?? known?.name_fr ?? '',

          currentId_de: revision_de.id,
          currentId_en: revision_en.id,
          currentId_es: revision_es.id,
          currentId_fr: revision_fr.id,

          history: {
            connectOrCreate: [
              { where: { colorId_revisionId: { revisionId: revision_de.id, colorId: id }}, create: { revisionId: revision_de.id }},
              { where: { colorId_revisionId: { revisionId: revision_en.id, colorId: id }}, create: { revisionId: revision_en.id }},
              { where: { colorId_revisionId: { revisionId: revision_es.id, colorId: id }}, create: { revisionId: revision_es.id }},
              { where: { colorId_revisionId: { revisionId: revision_fr.id, colorId: id }}, create: { revisionId: revision_fr.id }},
            ]
          },

          lastCheckedAt: new Date(),
          removedFromApi: false,
        } satisfies Prisma.ColorUncheckedCreateInput & Prisma.ColorUncheckedUpdateInput;

        // update in db
        await tx.color.upsert({
          where: { id },
          create: data,
          update: data
        });

        processedEntityCount++;
      });
    }

    return `Updated ${processedEntityCount}/${data.ids.length}`;
  }

};

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
  if(knownData !== updatedData || wasRemoved) {
    return tx.revision.create({ data: { ...base, data: updatedData, type: 'Update', description: 'Updated in API' }});
  }

  // nothing has changed, so we don't need to create a new revision
  return undefined;
}
