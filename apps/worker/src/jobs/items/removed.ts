import { Job } from '../job';
import { db } from '../../db';
import { Prisma } from '@gw2treasures/database';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { appendHistory } from '../helper/appendHistory';
import { schema } from '../helper/schema';
import { createRevisionHash } from '../helper/revision';

export const ItemsRemoved: Job = {
  run: async (removedIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    for(const removedId of removedIds) {
      const item = await db.item.findUnique({ where: { id: removedId }, include: { current_de: true, current_en: true, current_es: true, current_fr: true }});

      if(!item) {
        continue;
      }

      const update: Prisma.ItemUpdateArgs['data'] = {
        removedFromApi: true,
        history: { createMany: { data: [] }}
      };

      // create a new revision
      for(const language of ['de', 'en', 'es', 'fr'] as const) {
        const revision = await db.revision.create({
          data: {
            schema,
            previousRevisionId: item[`currentId_${language}`],
            data: item[`current_${language}`].data,
            hash: createRevisionHash(item[`current_${language}`].data),
            description: 'Removed from API',
            type: 'Removed',
            entity: 'Item',
            language,
            buildId,
          }
        });

        update[`currentId_${language}`] = revision.id;
        update.history = appendHistory(update, revision.id);
      }

      await db.item.update({ where: { id: removedId }, data: update });
    }

    return `Marked ${removedIds.length} items as removed`;
  }
};
