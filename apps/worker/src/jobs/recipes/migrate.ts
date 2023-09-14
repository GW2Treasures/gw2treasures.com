import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { Gw2Api } from 'gw2-api-types';
import { createMigrator, CURRENT_VERSION } from './migrations';

export const RecipesMigrate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['recipes.migrate'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      const idsToUpdate = (await db.recipe.findMany({
        where: { version: { lt: CURRENT_VERSION }},
        orderBy: { updatedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      queueJobForIds('recipes.migrate', idsToUpdate, 1);
      return `Queued migration for ${idsToUpdate.length} recipes`;
    }

    const recipesToMigrate = await db.recipe.findMany({
      where: { id: { in: ids }},
      include: { currentRevision: true },
    });

    if(recipesToMigrate.length === 0) {
      return 'No recipes to update';
    }

    const migrate = await createMigrator();

    for(const recipe of recipesToMigrate) {
      const data: Gw2Api.Recipe = JSON.parse(recipe.currentRevision.data);
      const update = await migrate(data, recipe.version);

      try {
        await db.recipe.update({ where: { id: recipe.id }, data: update });
      } catch(cause) {
        console.log(update);
        throw new Error(`Error migrating recipe ${recipe.id}`, { cause });
      }
    }

    return `Migrated ${recipesToMigrate.length} recipes to version ${CURRENT_VERSION}`;
  }
};
