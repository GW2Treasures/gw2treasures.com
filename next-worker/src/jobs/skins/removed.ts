import { Job } from '../job';
import { Prisma } from '@prisma/client';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { appendHistory } from '../helper/appendHistory';

export const SkinsRemoved: Job = {
  run: async (db, removedIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    for(const removedId of removedIds) {
      const skin = await db.skin.findUnique({ where: { id: removedId }, include: { current_de: true, current_en: true, current_es: true, current_fr: true }});

      if(!skin) {
        continue;
      }

      const update: Prisma.SkinUpdateArgs['data'] = {
        removedFromApi: true,
        history: { createMany: { data: [] }}
      };

      // create a new revision
      for(const language of ['de', 'en', 'es', 'fr'] as const) {
        const revision = await db.revision.create({
          data: {
            data: skin[`current_${language}`].data,
            description: 'Removed from API',
            type: 'Removed',
            entity: 'Skin',
            language,
            buildId,
          }
        });

        update[`currentId_${language}`] = revision.id;
        update.history = appendHistory(update, revision.id);
      }

      await db.skin.update({ where: { id: removedId }, data: update });
    }

    return `Marked ${removedIds.length} skins as removed`;
  }
};
