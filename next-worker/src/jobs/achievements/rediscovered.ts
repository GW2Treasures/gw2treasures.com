import { Job } from '../job';
import { Prisma } from '@prisma/client';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadAchievements } from '../helper/loadAchievements';
import { createIcon } from '../helper/createIcon';
import { appendHistory } from '../helper/appendHistory';
import { createMigrator } from './migrations';

export const AchievementsRediscovered: Job = {
  run: async (db, rediscoveredIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    if(rediscoveredIds.length === 0) {
      return;
    }

    const achievements = await loadAchievements(rediscoveredIds);
    const migrate = await createMigrator();

    for(const [id, data] of achievements) {
      const achievement = await db.achievement.findUnique({ where: { id }});

      if(!achievement) {
        continue;
      }

      const iconId = await createIcon(data.en.icon, db);
      const migratedData = await migrate(data);

      const update: Prisma.AchievementUpdateArgs['data'] = {
        removedFromApi: false,
        name_de: data.de.name,
        name_en: data.en.name,
        name_es: data.es.name,
        name_fr: data.fr.name,
        ...migratedData,
        iconId,
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
        update.history = appendHistory(update, revision.id);
      }

      await db.achievement.update({ where: { id: achievement.id }, data: update });
    }

    return `Rediscovered ${rediscoveredIds.length} achievements`;
  }
};
