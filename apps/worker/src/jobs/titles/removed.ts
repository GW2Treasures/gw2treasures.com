import { Job } from '../job';
import { db } from '../../db';
import { Prisma } from '@gw2treasures/database';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { appendHistory } from '../helper/appendHistory';

export const TitlesRemoved: Job = {
  run: async (removedIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    for(const removedId of removedIds) {
      const title = await db.title.findUnique({ where: { id: removedId }, include: { current_de: true, current_en: true, current_es: true, current_fr: true }});

      if(!title) {
        continue;
      }

      const update: Prisma.TitleUpdateArgs['data'] = {
        removedFromApi: true,
        history: { createMany: { data: [] }}
      };

      // create a new revision
      for(const language of ['de', 'en', 'es', 'fr'] as const) {
        const revision = await db.revision.create({
          data: {
            data: title[`current_${language}`].data,
            description: 'Removed from API',
            type: 'Removed',
            entity: 'Title',
            language,
            buildId,
          }
        });

        update[`currentId_${language}`] = revision.id;
        update.history = appendHistory(update, revision.id);
      }

      await db.title.update({ where: { id: removedId }, data: update });
    }

    return `Marked ${removedIds.length} titles as removed`;
  }
};
