import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadSkills } from '../helper/loadSkills';
import { createIcon } from '../helper/createIcon';
import { createRevisions } from '../helper/revision';

export const SkillsNew: Job = {
  run: async (newIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    // load skills from API
    const skills = await loadSkills(newIds);

    for(const [id, { de, en, es, fr }] of skills) {
      const revisions = await createRevisions({ de, en, es, fr }, { buildId, type: 'Added', entity: 'Skill', description: 'Added to API' });

      const iconId = await createIcon(en.icon);

      const professions = await db.profession.findMany({
        where: { skillIds: { has: en.id }},
        select: { id: true },
      });

      const flippedSkill = await db.skill.findMany({ where: { flipSkillIdRaw: en.id }, select: { id: true }});

      await db.skill.create({
        data: {
          id,
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          iconId,
          professions: { connect: professions },
          flippedSkill: { connect: flippedSkill },
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
