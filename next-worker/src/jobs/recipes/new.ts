import { Job } from '../job';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from '../helper/fetchApi';
import { toId } from '../helper/toId';

export const RecipesNew: Job = {
  run: async (db, newIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    // load recipes from API
    const recipes = await fetchApi<Gw2Api.Recipe[]>(`/v2/recipes?v=latest&ids=${newIds.join(',')}`);

    for(const recipe of recipes) {
      const revision = await db.revision.create({ data: { data: JSON.stringify(recipe), language: 'en', buildId, type: 'Added', entity: 'Recipe', description: 'Added to API' } });

      // check which items exist
      const itemIngredients = recipe.ingredients
        .filter((ingredient) => ingredient.type === 'Item');

      const items = await db.item.findMany({
        where: { id: { in: [recipe.output_item_id, ...itemIngredients.map(toId)] }}
      });

      const i = await db.recipe.create({ data: {
        id: recipe.id,
        type: recipe.type,
        rating: recipe.min_rating,
        disciplines: recipe.disciplines,
        outputCount: recipe.output_item_count,
        outputItemId: items.some(({ id }) => id === recipe.output_item_id) ? recipe.output_item_id : undefined,
        timeToCraftMs: recipe.time_to_craft_ms,
        currentRevisionId: revision.id,
        history: { connect: { id: revision.id } },
        itemIngredients: { createMany: {
          data: itemIngredients
            .filter((ingredient) => items.some(({ id }) => id === ingredient.id))
            .map(({ id, count }) => ({ itemId: id, count }))
        }}
      }});
    }

    return `Added ${recipes.length} recipes`;
  }
}
