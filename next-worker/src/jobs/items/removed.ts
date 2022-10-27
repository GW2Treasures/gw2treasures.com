import { Job } from '../job';
import { Prisma } from '@prisma/client';
import { getCurrentBuild } from '../helper/getCurrentBuild';

export const ItemsRemoved: Job = {
  run: async (db, removedIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    for(const removedId of removedIds) {
      const item = await db.item.findUnique({ where: { id: removedId }, include: { current_de: true, current_en: true, current_es: true, current_fr: true } });
  
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
            data: item[`current_${language}`].data,
            description: 'Removed from API',
            language,
            buildId,
          }
        });
  
        update[`currentId_${language}`] = revision.id;
        update.history!.createMany!.data = [...update.history!.createMany!.data as Prisma.ItemHistoryCreateManyItemInput[], { revisionId: revision.id }];
      }
  
      await db.item.update({ where: { id: removedId }, data: update });
    }
  }
}
