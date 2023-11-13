// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Prisma } from '@gw2treasures/database';
import { Gw2Api } from 'gw2-api-types';
import { toId } from '../helper/toId';
import { db } from '../../db';

export const CURRENT_VERSION = 3;

/** @see Prisma.RecipeUpdateInput  */
interface MigratedRecipe {
  version: number

  flags?: string[];

  outputItemIdRaw?: number;
  itemIngredientIds?: number[];
  outputItemId?: number;

  itemIngredients?: Prisma.IngredientItemUpdateManyWithoutRecipeNestedInput
}

export async function createMigrator() {
  const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);

  // eslint-disable-next-line require-await
  return async function migrate(recipe: Gw2Api.Recipe, currentVersion = -1) {
    const update: MigratedRecipe = {
      version: CURRENT_VERSION
    };

    // Version 1: Add flags
    if(currentVersion < 1) {
      update.flags = recipe.flags;
    }

    // Version 2: Add raw item ids in case recipe gets added to db first
    // Version 3: Fix non item ids being added
    if(currentVersion < 3) {
      const itemIngredients = recipe.ingredients.filter(({ type }) => type === 'Item');

      update.outputItemIdRaw = recipe.output_item_id;
      update.itemIngredientIds = itemIngredients.map(toId);

      // update relations if they were missed in the past
      update.outputItemId = knownItemIds.includes(recipe.output_item_id) ? recipe.output_item_id : undefined;
      update.itemIngredients = {
        connectOrCreate: itemIngredients.filter(({ id }) => knownItemIds.includes(id)).map((ingredient) => ({
          where: { recipeId_itemId: { itemId: ingredient.id, recipeId: recipe.id }},
          create: {
            itemId: ingredient.id,
            count: ingredient.count
          }
        })),
        deleteMany: { recipeId: recipe.id, itemId: { notIn: itemIngredients.map(toId) }}
      };
    }

    return update;
  };
}
