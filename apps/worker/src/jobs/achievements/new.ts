import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadAchievements } from '../helper/loadAchievements';
import { createIcon } from '../helper/createIcon';
import { createRevisions } from '../helper/revision';
import { createMigrator } from './migrations';

export const AchievementsNew: Job = {
  run: async (newIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    // load achievements from API
    const achievements = await loadAchievements(newIds);

    const migrate = await createMigrator();

    for(const [id, { de, en, es, fr }] of achievements) {
      const revisions = await createRevisions({ de, en, es, fr }, { buildId, type: 'Added', entity: 'Achievement', description: 'Added to API' });
      const iconId = await createIcon(en.icon);
      const data = await migrate({ de, en, es, fr });
      const prerequisiteFor = await db.achievement.findMany({ where: { prerequisitesIds: { has: id }}, select: { id: true }});

      await db.achievement.create({
        data: {
          id,
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          iconId,
          ...data,
          currentId_de: revisions.de.id,
          currentId_en: revisions.en.id,
          currentId_es: revisions.es.id,
          currentId_fr: revisions.fr.id,
          history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }] }},
          prerequisiteFor: { connect: prerequisiteFor },
        }
      });
    }

    return `Added ${achievements.size} achievements`;
  }
};
