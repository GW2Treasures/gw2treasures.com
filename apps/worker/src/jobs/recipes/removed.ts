import { Job } from '../job';
import { db } from '../../db';
import { Prisma } from '@gw2treasures/database';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { schema } from '../helper/schema';
import { appendHistory } from '../helper/appendHistory';

export const RecipesRemoved: Job = {
  run: async (removedIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    for(const removedId of removedIds) {
      const recipe = await db.recipe.findUnique({
        where: { id: removedId },
        include: { current: true }
      });

      if(!recipe) {
        continue;
      }

      const revision = await db.revision.create({
        data: {
          schema,
          data: recipe.current.data,
          description: 'Removed from API',
          type: 'Removed',
          entity: 'Recipe',
          language: 'en',
          buildId,
        }
      });

      const update: Prisma.RecipeUpdateArgs['data'] = {
        removedFromApi: true,
        currentId: revision.id,
      };

      update.history = appendHistory(update, revision.id);

      await db.recipe.update({ where: { id: removedId }, data: update });
    }

    return `Marked ${removedIds.length} recipes as removed`;
  }
};
