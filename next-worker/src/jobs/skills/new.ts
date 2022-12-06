import { Job } from '../job';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadSkills } from '../helper/loadSkills';
import { createIcon } from '../helper/createIcon';

export const SkillsNew: Job = {
  run: async (db, newIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    // load skills from API
    const skills = await loadSkills(newIds);

    for(const { de, en, es, fr } of skills) {
      const revision_de = await db.revision.create({ data: { data: JSON.stringify(de), language: 'de', buildId, type: 'Added', entity: 'Skill', description: 'Added to API' } });
      const revision_en = await db.revision.create({ data: { data: JSON.stringify(en), language: 'en', buildId, type: 'Added', entity: 'Skill', description: 'Added to API' } });
      const revision_es = await db.revision.create({ data: { data: JSON.stringify(es), language: 'es', buildId, type: 'Added', entity: 'Skill', description: 'Added to API' } });
      const revision_fr = await db.revision.create({ data: { data: JSON.stringify(fr), language: 'fr', buildId, type: 'Added', entity: 'Skill', description: 'Added to API' } });

      const iconId = await createIcon(en.icon, db);

      await db.skill.create({ data: {
        id: en.id,
        name_de: de.name,
        name_en: en.name,
        name_es: es.name,
        name_fr: fr.name,
        iconId: iconId,
        version: 1,
        currentId_de: revision_de.id,
        currentId_en: revision_en.id,
        currentId_es: revision_es.id,
        currentId_fr: revision_fr.id,
        history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }]} }
      }});
    }

    return `Added ${skills.length} skills`;
  }
}
