import { Job } from '../job';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadItems } from '../helper/loadItems';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { Prisma } from '@prisma/client';
import { ApiItem } from '../../apiTypes';

export const CURRENT_VERSION = 1;

export const ItemsMigrate: Job = {
  run: async (db, ids: number[] | {}) => {
    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['items.migrate'] }, state: { in: ['Queued', 'Running'] }, cron: null } })

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      const idsToUpdate = (await db.item.findMany({
        where: { version: { lt: CURRENT_VERSION } },
        orderBy: { updatedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      queueJobForIds(db, 'items.migrate', idsToUpdate, 1);
      return `Queued migration for ${idsToUpdate.length} items`;
    }
    
    const itemsToMigrate = await db.item.findMany({
      where: { id: { in: ids } },
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
    });

    if(itemsToMigrate.length === 0) {
      return 'No items to update';
    }

    for(const item of itemsToMigrate) {
      const data: ApiItem = JSON.parse(item.current_en.data);

      const update: Prisma.ItemUpdateInput = {
        version: CURRENT_VERSION
      };

      if(item.version <= 0) {
        update.type = data.type;
        update.subtype = data.details?.type;
        update.weight = data.details?.weight_class;
        update.value = data.vendor_value;
        update.level = data.level;
      }

      await db.item.update({ where: { id: item.id }, data: update });
    }
    
    return `Migrated ${itemsToMigrate.length} items to version ${CURRENT_VERSION}`; 
  }
}
