import { Job } from '../job';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { Prisma } from '@prisma/client';
import { ApiSkin } from '../../apiTypes';

export const CURRENT_VERSION = 0;

export const SkinsMigrate: Job = {
  run: async (db, ids: number[] | {}) => {
    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['skins.migrate'] }, state: { in: ['Queued', 'Running'] }, cron: null } })

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      const idsToUpdate = (await db.skin.findMany({
        where: { version: { lt: CURRENT_VERSION } },
        orderBy: { updatedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      queueJobForIds(db, 'skins.migrate', idsToUpdate, 1);
      return `Queued migration for ${idsToUpdate.length} skins`;
    }

    const skinsToMigrate = await db.skin.findMany({
      where: { id: { in: ids } },
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
    });

    if(skinsToMigrate.length === 0) {
      return 'No skins to update';
    }

    for(const skin of skinsToMigrate) {
      const data: ApiSkin = JSON.parse(skin.current_en.data);

      const update: Prisma.SkinUpdateInput = {
        version: CURRENT_VERSION
      };

      await db.skin.update({ where: { id: skin.id }, data: update });
    }

    return `Migrated ${skinsToMigrate.length} skins to version ${CURRENT_VERSION}`;
  }
}
