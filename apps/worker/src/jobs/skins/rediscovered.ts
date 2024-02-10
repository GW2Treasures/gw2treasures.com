import { Job } from '../job';
import { db } from '../../db';
import { Prisma } from '@gw2treasures/database';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadSkins } from '../helper/loadSkins';
import { createIcon } from '../helper/createIcon';
import { appendHistory } from '../helper/appendHistory';
import { schema } from '../helper/schema';

export const SkinsRediscovered: Job = {
  run: async (rediscoveredIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(rediscoveredIds.length === 0) {
      return;
    }

    const skins = await loadSkins(rediscoveredIds);

    for(const [id, data] of skins) {
      const skin = await db.skin.findUnique({ where: { id }});

      if(!skin) {
        continue;
      }

      const iconId = await createIcon(data.en.icon);

      const update: Prisma.SkinUpdateArgs['data'] = {
        removedFromApi: false,
        name_de: data.de.name,
        name_en: data.en.name,
        name_es: data.es.name,
        name_fr: data.fr.name,
        iconId,
        lastCheckedAt: new Date(),
        history: { createMany: { data: [] }}
      };

      // create a new revision
      for(const language of ['de', 'en', 'es', 'fr'] as const) {
        const revision = await db.revision.create({
          data: {
            schema,
            data: JSON.stringify(data[language]),
            description: 'Rediscovered in API',
            entity: 'Skin',
            language,
            buildId,
          }
        });

        update[`currentId_${language}`] = revision.id;
        update.history = appendHistory(update, revision.id);
      }

      await db.skin.update({ where: { id: skin.id }, data: update });
    }

    return `Rediscovered ${rediscoveredIds.length} skins`;
  }
};
