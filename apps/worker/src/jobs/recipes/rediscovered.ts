import { Job } from '../job';
import { db } from '../../db';
import { Prisma } from '@gw2treasures/database';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { createMigrator } from './migrations';
import { loadRecipes } from '../helper/loadRecipes';

export const RecipesRediscovered: Job = {
  run: async (rediscoveredIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(rediscoveredIds.length === 0) {
      return;
    }

    const recipes = await loadRecipes(rediscoveredIds);
    const migrate = await createMigrator();

    for(const data of recipes) {
      const recipe = await db.recipe.findUnique({ where: { id: data.id }});

      if(!recipe) {
        continue;
      }

      // load output item
      const outputItem = await db.item.findUnique({
        where: { id: data.output_item_id },
        select: { id: true }
      });

      const unlockedByItemIds = await db.item.findMany({ where: { unlocksRecipeIds: { has: recipe.id }}, select: { id: true }});

      const migratedData = await migrate(data);

      const revision = await db.revision.create({
        data: {
          data: JSON.stringify(data),
          description: 'Rediscovered in API',
          entity: 'Recipe',
          language: 'en',
          buildId,
        }
      });

      const update: Prisma.RecipeUpdateArgs['data'] = {
        removedFromApi: false,
        type: data.type,
        rating: data.min_rating,
        disciplines: data.disciplines,
        outputCount: data.output_item_count,
        outputItemId: outputItem?.id,
        timeToCraftMs: data.time_to_craft_ms,

        unlockedByItems: { set: unlockedByItemIds },

        ...migratedData,

        lastCheckedAt: new Date(),
        history: { connect: { id: revision.id }},
        currentRevisionId: revision.id,
      };

      await db.recipe.update({ where: { id: recipe.id }, data: update });
    }

    return `Rediscovered ${rediscoveredIds.length} recipes`;
  }
};
