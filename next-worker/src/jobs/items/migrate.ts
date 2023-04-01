import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { Gw2Api } from 'gw2-api-types';
import { createMigrator, CURRENT_VERSION } from './migrations';

export { CURRENT_VERSION };

export const ItemsMigrate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['items.migrate'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      const idsToUpdate = (await db.item.findMany({
        where: { version: { lt: CURRENT_VERSION }},
        orderBy: { updatedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      queueJobForIds('items.migrate', idsToUpdate, 1);
      return `Queued migration for ${idsToUpdate.length} items`;
    }

    const itemsToMigrate = await db.item.findMany({
      where: { id: { in: ids }},
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
    });

    if(itemsToMigrate.length === 0) {
      return 'No items to update';
    }

    const migrate = await createMigrator();

    for(const item of itemsToMigrate) {
      const de: Gw2Api.Item = JSON.parse(item.current_de.data);
      const en: Gw2Api.Item = JSON.parse(item.current_en.data);
      const es: Gw2Api.Item = JSON.parse(item.current_es.data);
      const fr: Gw2Api.Item = JSON.parse(item.current_fr.data);

      const data = await migrate({ de, en, es, fr }, item.version);

      await db.item.update({ where: { id: item.id }, data });
    }

    return `Migrated ${itemsToMigrate.length} items to version ${CURRENT_VERSION}`;
  }
};
