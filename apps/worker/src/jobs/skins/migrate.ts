import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { createMigrator, CURRENT_VERSION } from './migrations';
import { Gw2Api } from 'gw2-api-types';

export const SkinsMigrate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['skins.migrate'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      const idsToUpdate = (await db.skin.findMany({
        where: { version: { lt: CURRENT_VERSION }},
        orderBy: { updatedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      queueJobForIds('skins.migrate', idsToUpdate, { priority: 1 });
      return `Queued migration for ${idsToUpdate.length} skins`;
    }

    const skinsToMigrate = await db.skin.findMany({
      where: { id: { in: ids }},
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
    });

    if(skinsToMigrate.length === 0) {
      return 'No skins to update';
    }

    const migrate = await createMigrator();

    for(const skin of skinsToMigrate) {
      const de: Gw2Api.Skin = JSON.parse(skin.current_de.data);
      const en: Gw2Api.Skin = JSON.parse(skin.current_en.data);
      const es: Gw2Api.Skin = JSON.parse(skin.current_es.data);
      const fr: Gw2Api.Skin = JSON.parse(skin.current_fr.data);

      const data = await migrate({ de, en, es, fr }, skin.version);

      await db.skin.update({ where: { id: skin.id }, data });
    }

    return `Migrated ${skinsToMigrate.length} skins to version ${CURRENT_VERSION}`;
  }
};
