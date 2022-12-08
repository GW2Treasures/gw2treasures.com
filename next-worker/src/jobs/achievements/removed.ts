import { Job } from '../job';
import { Prisma } from '@prisma/client';
import { getCurrentBuild } from '../helper/getCurrentBuild';

export const AchievementsRemoved: Job = {
  run: async (db, removedIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    for(const removedId of removedIds) {
      const achievement = await db.achievement.findUnique({ where: { id: removedId }, include: { current_de: true, current_en: true, current_es: true, current_fr: true } });

      if(!achievement) {
        continue;
      }

      const update: Prisma.AchievementUpdateArgs['data'] = {
        removedFromApi: true,
        history: { createMany: { data: [] }}
      };

      // create a new revision
      for(const language of ['de', 'en', 'es', 'fr'] as const) {
        const revision = await db.revision.create({
          data: {
            data: achievement[`current_${language}`].data,
            description: 'Removed from API',
            type: 'Removed',
            entity: 'Achievement',
            language,
            buildId,
          }
        });

        update[`currentId_${language}`] = revision.id;
        update.history!.createMany!.data = [...update.history!.createMany!.data as Prisma.AchievementHistoryCreateManyAchievementInput[], { revisionId: revision.id }];
      }

      await db.achievement.update({ where: { id: removedId }, data: update });
    }

    return `Marked ${removedIds.length} achievements as removed`;
  }
}
