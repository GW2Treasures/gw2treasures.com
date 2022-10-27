import { Job } from '../job';
import { Prisma } from '@prisma/client';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadItems } from '../helper/loadItems';

export const ItemsRediscovered: Job = {
  run: async (db, rediscoveredIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    if(rediscoveredIds.length === 0) {
      return;
    }

    const items = await loadItems(rediscoveredIds);
  
    for(const data of items) {
      const item = await db.item.findUnique({ where: { id: data.en.id } });
  
      if(!item) {
        continue;
      }
  
      const update: Prisma.ItemUpdateArgs['data'] = {
        removedFromApi: false,
        name_de: data.de.name,
        name_en: data.en.name,
        name_es: data.es.name,
        name_fr: data.fr.name,
        history: { createMany: { data: [] }}
      };
  
      // create a new revision
      for(const language of ['de', 'en', 'es', 'fr'] as const) {
        const revision = await db.revision.create({
          data: {
            data: JSON.stringify(data[language]),
            description: 'Rediscovered in API',
            language,
            buildId,
          }
        });
  
        update[`currentId_${language}`] = revision.id;
        update.history!.createMany!.data = [...update.history!.createMany!.data as Prisma.ItemHistoryCreateManyItemInput[], { revisionId: revision.id }];
      }
  
      console.log(update);
      await db.item.update({ where: { id: item.id }, data: update });
    }
  }
}
