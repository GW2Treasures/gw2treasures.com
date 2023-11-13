import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from '../helper/fetchApi';
import { createMigrator } from './migrations';

export const RecipesNew: Job = {
  run: async (newIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    // load recipes from API
    const recipes = await fetchApi<Gw2Api.Recipe[]>(`/v2/recipes?ids=${newIds.join(',')}`);

    const migrate = await createMigrator();

    for(const recipe of recipes) {
      const revision = await db.revision.create({ data: { data: JSON.stringify(recipe), language: 'en', buildId, type: 'Added', entity: 'Recipe', description: 'Added to API' }});

      // load output item
      const outputItem = await db.item.findUnique({
        where: { id: recipe.output_item_id },
        select: { id: true }
      });

      const unlockedByItemIds = await db.item.findMany({ where: { unlocksRecipeIds: { has: recipe.id }}, select: { id: true }});

      const data = await migrate(recipe);

      await db.recipe.create({
        data: {
          id: recipe.id,
          type: recipe.type,
          rating: recipe.min_rating,
          disciplines: recipe.disciplines,
          outputCount: recipe.output_item_count,
          outputItemId: outputItem?.id,
          timeToCraftMs: recipe.time_to_craft_ms,

          ...data,

          currentRevisionId: revision.id,
          history: { connect: { id: revision.id }},

          unlockedByItems: { connect: unlockedByItemIds }
        }
      });
    }

    return `Added ${recipes.length} recipes`;
  }
};
