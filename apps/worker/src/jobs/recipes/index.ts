import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { loadRecipes } from '../helper/loadRecipes';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { Changes, type ProcessEntitiesData, createSubJobs, processEntities } from '../helper/process-entities';
import { toId } from '../helper/toId';
import { Prisma } from '@gw2treasures/database';
import { enumerableToArray } from '../helper/appendHistory';

const CURRENT_VERSION = 8;

export const RecipesJob: Job = {
  async run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'recipes',
        () => fetchApi('/v2/recipes'),
        db.recipe.findMany,
        CURRENT_VERSION
      );
    }

    const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);
    const knownCurrencyIds = (await db.currency.findMany({ select: { id: true }})).map(toId);
    const knownGuildUpgradeIds = (await db.guildUpgrade.findMany({ select: { id: true }})).map(toId);

    return processEntities(
      data,
      'Recipe',
      (recipeId, revisionId) => ({ recipeId_revisionId: { revisionId, recipeId }}),
      async (recipe, version, changes) => {
        // get all items that unlock this recipe
        const unlockedByItemIds = await db.item.findMany({
          where: { unlocksRecipeIds: { has: recipe.id }},
          select: { id: true }
        });

        type CreateOrUpdateIngredients =
          | Prisma.RecipeIngredientUncheckedCreateNestedManyWithoutRecipeInput
          | Prisma.RecipeIngredientUncheckedUpdateManyWithoutRecipeNestedInput;

        // create or update the ingredients
        const ingredients: CreateOrUpdateIngredients = {
          upsert: recipe.ingredients.map((ingredient) => ({
            where: { recipeId_type_ingredientId: { recipeId: recipe.id, type: ingredient.type, ingredientId: ingredient.id }},
            create: {
              type: ingredient.type,
              ingredientId: ingredient.id,
              count: ingredient.count,
              itemId: ingredient.type === 'Item' && knownItemIds.includes(ingredient.id) ? ingredient.id : null,
              currencyId: ingredient.type === 'Currency' && knownCurrencyIds.includes(ingredient.id) ? ingredient.id : null,
              guildUpgradeId: ingredient.type === 'GuildUpgrade' && knownGuildUpgradeIds.includes(ingredient.id) ? ingredient.id : null,
            },
            update: {
              count: ingredient.count,
              itemId: ingredient.type === 'Item' && knownItemIds.includes(ingredient.id) ? ingredient.id : null,
              currencyId: ingredient.type === 'Currency' && knownCurrencyIds.includes(ingredient.id) ? ingredient.id : null,
              guildUpgradeId: ingredient.type === 'GuildUpgrade' && knownGuildUpgradeIds.includes(ingredient.id) ? ingredient.id : null,
            }
          })),
          deleteMany: {
            recipeId: recipe.id,
            NOT: recipe.ingredients.map((ingredient) => ({ type: ingredient.type, ingredientId: ingredient.id }))
          },
        };

        if(changes === Changes.New) {
          // we can't and don't have to use upsert when creating the entry
          if(ingredients.upsert) {
            ingredients.create = enumerableToArray(ingredients.upsert).map(({ create }) => create);
            delete ingredients.upsert;
          }

          // and we also never have to delete any existing ingredients
          delete ingredients.deleteMany;
        }

        return {
          type: recipe.type,
          rating: recipe.min_rating,
          disciplines: recipe.disciplines,
          outputCount: recipe.output_item_count,
          timeToCraftMs: recipe.time_to_craft_ms,
          flags: recipe.flags,
          ingredientCount: recipe.ingredients.length,

          outputItemIdRaw: recipe.output_item_id,
          outputItemId: knownItemIds.includes(recipe.output_item_id) ? recipe.output_item_id : undefined,

          outputGuildUpgradeIdRaw: recipe.output_upgrade_id,
          outputGuildUpgradeId: knownGuildUpgradeIds.includes(recipe.output_upgrade_id!) ? recipe.output_upgrade_id : undefined,

          unlockedByItems: { [changes === Changes.New ? 'connect' : 'set']: unlockedByItemIds },

          ingredients,
        } satisfies Partial<Prisma.RecipeUncheckedCreateInput | Prisma.RecipeUncheckedUpdateInput>;
      },
      db.recipe.findMany,
      loadRecipes,
      (tx, data) => tx.recipe.create(data),
      (tx, data) => tx.recipe.update(data),
      CURRENT_VERSION
    );
  }
};
