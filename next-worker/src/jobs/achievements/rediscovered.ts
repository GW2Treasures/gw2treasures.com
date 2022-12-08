import { Job } from '../job';
import { Prisma } from '@prisma/client';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadAchievements } from '../helper/loadAchievements';
import { createIcon } from '../helper/createIcon';

export const AchievementsRediscovered: Job = {
  run: async (db, rediscoveredIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    if(rediscoveredIds.length === 0) {
      return;
    }

    const achievements = await loadAchievements(rediscoveredIds);

    for(const data of achievements) {
      const achievement = await db.achievement.findUnique({ where: { id: data.en.id } });

      if(!achievement) {
        continue;
      }

      const iconId = await createIcon(data.en.icon, db);

      const update: Prisma.AchievementUpdateArgs['data'] = {
        removedFromApi: false,
        name_de: data.de.name,
        name_en: data.en.name,
        name_es: data.es.name,
        name_fr: data.fr.name,
        iconId: iconId,
        lastCheckedAt: new Date(),
        history: { createMany: { data: [] }}
      };

      // create a new revision
      for(const language of ['de', 'en', 'es', 'fr'] as const) {
        const revision = await db.revision.create({
          data: {
            data: JSON.stringify(data[language]),
            description: 'Rediscovered in API',
            entity: 'Achievement',
            language,
            buildId,
          }
        });

        update[`currentId_${language}`] = revision.id;
        update.history!.createMany!.data = [...update.history!.createMany!.data as Prisma.AchievementHistoryCreateManyAchievementInput[], { revisionId: revision.id }];
      }

      await db.achievement.update({ where: { id: achievement.id }, data: update });
    }

    return `Rediscovered ${rediscoveredIds.length} achievements`;
  }
}
