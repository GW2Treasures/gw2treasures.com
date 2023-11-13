import { Job } from '../job';
import { db } from '../../db';
import { Prisma } from '@gw2treasures/database';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadTitles } from '../helper/loadTitles';
import { appendHistory } from '../helper/appendHistory';
import { createMigrator } from './migrations';

export const TitlesRediscovered: Job = {
  run: async (rediscoveredIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(rediscoveredIds.length === 0) {
      return;
    }

    const titles = await loadTitles(rediscoveredIds);
    const migrate = await createMigrator();

    for(const [id, data] of titles) {
      const title = await db.title.findUnique({ where: { id }});

      if(!title) {
        continue;
      }

      const migratedData = await migrate(data);

      const update: Prisma.TitleUpdateArgs['data'] = {
        removedFromApi: false,
        name_de: data.de.name,
        name_en: data.en.name,
        name_es: data.es.name,
        name_fr: data.fr.name,
        ...migratedData,
        lastCheckedAt: new Date(),
        history: { createMany: { data: [] }}
      };

      // create a new revision
      for(const language of ['de', 'en', 'es', 'fr'] as const) {
        const revision = await db.revision.create({
          data: {
            data: JSON.stringify(data[language]),
            description: 'Rediscovered in API',
            entity: 'Title',
            language,
            buildId,
          }
        });

        update[`currentId_${language}`] = revision.id;
        update.history = appendHistory(update, revision.id);
      }

      await db.title.update({ where: { id: title.id }, data: update });
    }

    return `Rediscovered ${rediscoveredIds.length} title`;
  }
};
