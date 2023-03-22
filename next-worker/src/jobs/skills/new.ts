import { Job } from '../job';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadSkills } from '../helper/loadSkills';
import { createIcon } from '../helper/createIcon';
import { createRevisions } from '../helper/revision';

export const SkillsNew: Job = {
  run: async (db, newIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    // load skills from API
    const skills = await loadSkills(newIds);

    for(const [id, { de, en, es, fr }] of skills) {
      const revisions = await createRevisions(db, { de, en, es, fr }, { buildId, type: 'Added', entity: 'Skill', description: 'Added to API' });

      const iconId = await createIcon(en.icon, db);

      await db.skill.create({
        data: {
          id,
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          iconId,
          version: 1,
          currentId_de: revisions.de.id,
          currentId_en: revisions.en.id,
          currentId_es: revisions.es.id,
          currentId_fr: revisions.fr.id,
          history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }] }}
        }
      });
    }

    return `Added ${skills.size} skills`;
  }
};
