import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadTitles } from '../helper/loadTitles';
import { createRevisions } from '../helper/revision';
import { createMigrator } from './migrations';

export const TitlesNew: Job = {
  run: async (newIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    // load titles from API
    const titles = await loadTitles(newIds);

    const migrate = await createMigrator();

    for(const [id, { de, en, es, fr }] of titles) {
      const revisions = await createRevisions({ de, en, es, fr }, { buildId, type: 'Added', entity: 'Title', description: 'Added to API' });
      const data = await migrate({ de, en, es, fr });

      const achievements = await db.achievement.findMany({ where: { rewardsTitleIds: { has: id }}, select: { id: true }});

      await db.title.create({
        data: {
          id,
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,

          ...data,

          currentId_de: revisions.de.id,
          currentId_en: revisions.en.id,
          currentId_es: revisions.es.id,
          currentId_fr: revisions.fr.id,
          history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }] }},

          achievements: { connect: achievements },
        }
      });
    }

    return `Added ${titles.size} titles`;
  }
};
