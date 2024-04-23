import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { Gw2Api } from 'gw2-api-types';
import { createMigrator, CURRENT_VERSION } from './migrations';

export const AchievementsMigrate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
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

      queueJobForIds('achievements.migrate', idsToUpdate, { priority: 1 });
      return `Queued migration for ${idsToUpdate.length} achievements`;
    }

    const achievementsToMigrate = await db.achievement.findMany({
      where: { id: { in: ids }},
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
    });

    if(achievementsToMigrate.length === 0) {
      return 'No achievements to update';
    }

    const migrate = await createMigrator();

    for(const achievement of achievementsToMigrate) {
      const de: Gw2Api.Achievement = JSON.parse(achievement.current_de.data);
      const en: Gw2Api.Achievement = JSON.parse(achievement.current_en.data);
      const es: Gw2Api.Achievement = JSON.parse(achievement.current_es.data);
      const fr: Gw2Api.Achievement = JSON.parse(achievement.current_fr.data);

      const data = await migrate({ de, en, es, fr }, achievement.version);

      await db.achievement.update({ where: { id: achievement.id }, data });
    }

    return `Migrated ${achievementsToMigrate.length} achievements to version ${CURRENT_VERSION}`;
  }
};
