import { Prisma } from '@gw2treasures/database';
import { toId } from '../helper/toId';
import { db } from '../../db';
import { Recipe } from '@gw2api/types/data/recipe';
import { SchemaVersion } from '../helper/schema';

export const CURRENT_VERSION = 8;

/** @see Prisma.RecipeUpdateInput  */
interface MigratedRecipe {
  version: number

  flags?: string[];

  outputItemIdRaw?: number;
  outputItemId?: number;

  ingredients?: Prisma.RecipeIngredientUpdateManyWithoutRecipeNestedInput

  outputGuildUpgradeIdRaw?: number;
  outputGuildUpgradeId?: number;

  ingredientCount?: number;
}

export async function createMigrator() {
  const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);
  const knownCurrencyIds = (await db.currency.findMany({ select: { id: true }})).map(toId);
  const knownGuildUpgradeIds = (await db.guildUpgrade.findMany({ select: { id: true }})).map(toId);

  // eslint-disable-next-line require-await
  return async function migrate(recipe: Recipe<SchemaVersion>, currentVersion = -1) {
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
      update.outputItemIdRaw = recipe.output_item_id;

      // update relations if they were missed in the past
      update.outputItemId = knownItemIds.includes(recipe.output_item_id) ? recipe.output_item_id : undefined;
    }

    // Version 6: Add output guild upgrade
    if(currentVersion < 6) {
      update.outputGuildUpgradeIdRaw = recipe.output_upgrade_id;
      update.outputGuildUpgradeId = recipe.output_upgrade_id && knownGuildUpgradeIds.includes(recipe.output_upgrade_id) ? recipe.output_upgrade_id : undefined;
    }

    // Version 7: Add ingredient count
    if(currentVersion < 7) {
      update.ingredientCount = recipe.ingredients.length;
    }

    // Version 8:
    if(currentVersion < 8) {
      update.ingredients = {
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
        }
      };
    }

    return update satisfies Prisma.RecipeUpdateInput;
  };
}
