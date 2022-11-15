import { Job } from '../job';
import { Prisma } from '@prisma/client';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadSkills } from '../helper/loadSkills';

export const SkillsRediscovered: Job = {
  run: async (db, rediscoveredIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    if(rediscoveredIds.length === 0) {
      return;
    }

    const skills = await loadSkills(rediscoveredIds);

    for(const data of skills) {
      const skill = await db.skill.findUnique({ where: { id: data.en.id } });

      if(!skill) {
        continue;
      }

      const update: Prisma.SkillUpdateArgs['data'] = {
        removedFromApi: false,
        name_de: data.de.name,
        name_en: data.en.name,
        name_es: data.es.name,
        name_fr: data.fr.name,
        lastCheckedAt: new Date(),
        history: { createMany: { data: [] }}
      };

      // create a new revision
      for(const language of ['de', 'en', 'es', 'fr'] as const) {
        const revision = await db.revision.create({
          data: {
            data: JSON.stringify(data[language]),
            description: 'Rediscovered in API',
            language,
            buildId,
          }
        });

        update[`currentId_${language}`] = revision.id;
        update.history!.createMany!.data = [...update.history!.createMany!.data as Prisma.SkillHistoryCreateManySkillInput[], { revisionId: revision.id }];
      }

      console.log(update);
      await db.skill.update({ where: { id: skill.id }, data: update });
    }

    return `Rediscovered ${rediscoveredIds.length} skills`;
  }
}
