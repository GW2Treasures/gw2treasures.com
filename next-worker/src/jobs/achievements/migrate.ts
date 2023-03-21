import { Job } from '../job';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { Prisma } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';

const CURRENT_VERSION = 1;

export const AchievementsMigrate: Job = {
  run: async (db, ids: number[] | Record<string, never>) => {
    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['achievements.migrate'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      const idsToUpdate = (await db.achievement.findMany({
        where: { version: { lt: CURRENT_VERSION }},
        orderBy: { updatedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      queueJobForIds(db, 'achievements.migrate', idsToUpdate, 1);
      return `Queued migration for ${idsToUpdate.length} achievements`;
    }

    const achievementsToMigrate = await db.achievement.findMany({
      where: { id: { in: ids }},
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
    });

    if(achievementsToMigrate.length === 0) {
      return 'No achievements to update';
    }

    for(const achievement of achievementsToMigrate) {
      const data: Gw2Api.Achievement = JSON.parse(achievement.current_en.data);

      const update: Prisma.AchievementUpdateInput = {
        version: CURRENT_VERSION
      };

      if(achievement.version < 1) {
        update.points = data.tiers.reduce((total, tier) => total + tier.points, 0);
      }

      await db.achievement.update({ where: { id: achievement.id }, data: update });
    }

    return `Migrated ${achievementsToMigrate.length} achievements to version ${CURRENT_VERSION}`;
  }
};
