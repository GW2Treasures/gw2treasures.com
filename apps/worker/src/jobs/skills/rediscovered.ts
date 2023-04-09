import { Job } from '../job';
import { db } from '../../db';
import { Prisma } from '@gw2treasures/database';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadSkills } from '../helper/loadSkills';
import { createIcon } from '../helper/createIcon';
import { appendHistory } from '../helper/appendHistory';

export const SkillsRediscovered: Job = {
  run: async (rediscoveredIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(rediscoveredIds.length === 0) {
      return;
    }

    const skills = await loadSkills(rediscoveredIds);

    for(const [id, data] of skills) {
      const skill = await db.skill.findUnique({ where: { id }});

      if(!skill) {
        continue;
      }

      const iconId = await createIcon(data.en.icon);

      const update: Prisma.SkillUpdateArgs['data'] = {
        removedFromApi: false,
        name_de: data.de.name,
        name_en: data.en.name,
        name_es: data.es.name,
        name_fr: data.fr.name,
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
            entity: 'Skill',
            language,
            buildId,
          }
        });

        update[`currentId_${language}`] = revision.id;
        update.history = appendHistory(update, revision.id);
      }

      await db.skill.update({ where: { id: skill.id }, data: update });
    }

    return `Rediscovered ${rediscoveredIds.length} skills`;
  }
};
