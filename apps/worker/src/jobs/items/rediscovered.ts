import { Job } from '../job';
import { db } from '../../db';
import { Prisma } from '@gw2treasures/database';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadItems } from '../helper/loadItems';
import { createIcon } from '../helper/createIcon';
import { appendHistory } from '../helper/appendHistory';
import { createMigrator } from './migrations';

export const ItemsRediscovered: Job = {
  run: async (rediscoveredIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(rediscoveredIds.length === 0) {
      return;
    }

    const items = await loadItems(rediscoveredIds);
    const migrate = await createMigrator();

    for(const [id, data] of items) {
      const item = await db.item.findUnique({ where: { id }});

      if(!item) {
        continue;
      }

      const iconId = await createIcon(data.en.icon);
      const migratedData = await migrate(data);

      const update: Prisma.ItemUpdateArgs['data'] = {
        removedFromApi: false,
        name_de: data.de.name,
        name_en: data.en.name,
        name_es: data.es.name,
        name_fr: data.fr.name,
        iconId,
        ...migratedData,
        lastCheckedAt: new Date(),
        history: { createMany: { data: [] }}
      };

      // create a new revision
      for(const language of ['de', 'en', 'es', 'fr'] as const) {
        const revision = await db.revision.create({
          data: {
            previousRevisionId: item[`currentId_${language}`],
            data: JSON.stringify(data[language]),
            description: 'Rediscovered in API',
            entity: 'Item',
            language,
            buildId,
          }
        });

        update[`currentId_${language}`] = revision.id;
        update.history = appendHistory(update, revision.id);
      }

      await db.item.update({ where: { id: item.id }, data: update });
    }

    return `Rediscovered ${rediscoveredIds.length} items`;
  }
};
