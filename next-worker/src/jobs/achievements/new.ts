import { Job } from '../job';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadAchievements } from '../helper/loadAchievements';
import { CURRENT_VERSION } from './migrate';
import { createIcon } from '../helper/createIcon';
import { createRevisions } from '../helper/revision';

export const AchievementsNew: Job = {
  run: async (db, newIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    // load achievements from API
    const achievements = await loadAchievements(newIds);

    for(const { de, en, es, fr } of achievements) {
      const revisions = await createRevisions(db, { de, en, es, fr }, { buildId, type: 'Added', entity: 'Achievement', description: 'Added to API' });
      const iconId = await createIcon(en.icon, db);

      await db.achievement.create({ data: {
        id: en.id,
        name_de: de.name,
        name_en: en.name,
        name_es: es.name,
        name_fr: fr.name,
        iconId: iconId,
        version: CURRENT_VERSION,
        currentId_de: revisions.de.id,
        currentId_en: revisions.en.id,
        currentId_es: revisions.es.id,
        currentId_fr: revisions.fr.id,
        history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }]} },
      }});
    }

    return `Added ${achievements.length} achievements`;
  }
}
