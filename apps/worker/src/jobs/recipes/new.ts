import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { createMigrator } from './migrations';
import { loadRecipes } from '../helper/loadRecipes';
import { schema } from '../helper/schema';
import { Prisma } from '@gw2treasures/database';
import { appendHistory, enumerableToArray } from '../helper/appendHistory';

export const RecipesNew: Job = {
  run: async (newIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    // load recipes from API
    const recipes = await loadRecipes(newIds);

    const migrate = await createMigrator();

    for(const [, recipe] of recipes) {
      const revision = await db.revision.create({ data: { data: JSON.stringify(recipe), language: 'en', buildId, type: 'Added', entity: 'Recipe', description: 'Added to API', schema }});

      // load output item
      const outputItem = await db.item.findUnique({
        where: { id: recipe.output_item_id },
        select: { id: true }
      });

      const unlockedByItemIds = await db.item.findMany({ where: { unlocksRecipeIds: { has: recipe.id }}, select: { id: true }});

      const data = await migrate(recipe);

      // delete `deleteMany` if it exists, because prisma doesn't allow deleteMany on create queries
      // also rename `upsert` to `connectOrCreate`
      if(data.ingredients) {
        if(data.ingredients.upsert) {
          data.ingredients.create = enumerableToArray(data.ingredients.upsert).map(({ create }) => create);
        }
        delete data.ingredients.deleteMany;
        delete data.ingredients.upsert;
      }

      const update: Prisma.RecipeCreateArgs['data'] = {
        id: recipe.id,
        type: recipe.type,
        rating: recipe.min_rating,
        disciplines: recipe.disciplines,
        outputCount: recipe.output_item_count,
        outputItemId: outputItem?.id,
        timeToCraftMs: recipe.time_to_craft_ms,

        ...data,

        currentId: revision.id,

        unlockedByItems: { connect: unlockedByItemIds }
      };

      update.history = appendHistory(update, revision.id);

      await db.recipe.create({
        data: update
      });
    }

    return `Added ${recipes.size} recipes`;
  }
};
