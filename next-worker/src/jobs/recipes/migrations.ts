import { Prisma } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';

export const CURRENT_VERSION = 1;

/** @see Prisma.RecipeUpdateInput  */
interface MigratedRecipe {
  version: number

  flags?: string[];
}

// eslint-disable-next-line require-await
export async function createMigrator() {
  // eslint-disable-next-line require-await
  return async function migrate(recipe: Gw2Api.Recipe, currentVersion = -1) {
    const update: MigratedRecipe = {
      version: CURRENT_VERSION
    };

    // Version 1: Add flags
    if(currentVersion < 1) {
      update.flags = recipe.flags;
    }

    return update;
  };
}
