import { db } from '@/lib/prisma';
import { publicApi, type PublicApiResponse } from '../../..';
import { cache } from '@/lib/cache';

const maxItemId = Math.pow(2, 31) - 1;
const maxAge = 60;

const getMysticForgeRecipes = cache(async (id: number): Promise<PublicApiResponse> => {
  const recipes = await db.mysticForgeRecipe.findMany({
    where: { outputItemId: id },
    select: {
      id: true,
      outputItemId: true,
      outputCountMin: true,
      outputCountMax: true,
      itemIngredients: {
        select: {
          itemId: true,
          count: true,
          id: true,
        }
      }
    }
  });

  if(!recipes) {
    return { error: 404, text: 'Item not found' };
  }

  return {
    json: recipes.map((recipe) => ({
      '_gw2treasures_recipe_id': recipe.id,
      output_item_id: recipe.outputItemId,
      output_item_count_min: recipe.outputCountMin,
      output_item_count_max: recipe.outputCountMax,
      ingredients: recipe.itemIngredients.map((ingredient) => ({
        item_id: ingredient.itemId,
        count: ingredient.count,
      })),
    })),
  };
}, ['api/items/:id/mystic-forge'], { revalidate: maxAge });

export const GET = publicApi<'id'>(
  '/items/:id/mystic-forge',
  ({ params: { id }}) => {
    const itemId = Number(id);

    // validate itemId
    if(isNaN(itemId) || itemId <= 0 || itemId > maxItemId || itemId.toString() !== id) {
      return { error: 400, text: 'Invalid item id' };
    }

    return getMysticForgeRecipes(itemId);
  },
  { maxAge }
);
