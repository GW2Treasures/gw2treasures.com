import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { createMigrator } from './migrations';
import { loadRecipes } from '../helper/loadRecipes';
import { toId } from '../helper/toId';
import { schema } from '../helper/schema';

export const RecipesUpdate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['recipes.update'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      // add 15 minutes to timestamp to make sure api cache is updated
      const checkDate = new Date(build.createdAt);
      checkDate.setMinutes(checkDate.getMinutes() + 15);

      const idsToUpdate = (await db.recipe.findMany({
        where: { lastCheckedAt: { lt: checkDate }, removedFromApi: false },
        orderBy: { lastCheckedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      await queueJobForIds('recipes.update', idsToUpdate, 1);
      return `Queued update for ${idsToUpdate.length} recipes (Build ${build.id})`;
    }

    const recipesToUpdate = await db.recipe.findMany({
      where: { id: { in: ids }},
      orderBy: { lastCheckedAt: 'asc' },
      include: { currentRevision: true },
      take: 200,
    });

    if(recipesToUpdate.length === 0) {
      return 'No recipes to update';
    }

    // load recipes from API
    const apiRecipes = await loadRecipes(recipesToUpdate.map(toId));

    const recipes = recipesToUpdate.map((existing) => ({
      existing,
      updated: apiRecipes.find(({ id }) => id === existing.id)!
    })).filter(({ updated }) => updated !== undefined);

    const migrate = await createMigrator();

    let updatedRecipes = 0;

    for(const { existing, updated } of recipes) {
      const changed = existing.currentRevision.data !== JSON.stringify(updated);

      if(!changed) {
        // nothing changed
        await db.recipe.update({ data: { lastCheckedAt: new Date() }, where: { id: existing.id }});
        continue;
      }

      const revision = changed ? await db.revision.create({ data: { data: JSON.stringify(updated), language: 'en', buildId, type: 'Update', entity: 'Recipe', description: 'Updated in API', schema }}) : existing.currentRevision;

      // load output item
      const outputItem = await db.item.findUnique({
        where: { id: updated.output_item_id },
        select: { id: true }
      });

      const unlockedByItemIds = await db.item.findMany({ where: { unlocksRecipeIds: { has: existing.id }}, select: { id: true }});
      const migratedData = await migrate(updated);

      await db.recipe.update({
        where: { id: existing.id },
        data: {
          removedFromApi: false,
          type: updated.type,
          rating: updated.min_rating,
          disciplines: updated.disciplines,
          outputCount: updated.output_item_count,
          outputItemId: outputItem?.id,
          timeToCraftMs: updated.time_to_craft_ms,

          unlockedByItems: { set: unlockedByItemIds },

          ...migratedData,

          lastCheckedAt: new Date(),
          history: { connect: { id: revision.id }},
          currentRevisionId: revision.id,
        }
      });

      updatedRecipes++;
    }

    return `Updated ${updatedRecipes}/${recipes.length} recipes`;
  }
};
