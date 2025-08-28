import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadSkills } from '../helper/loadSkills';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { createIcon } from '../helper/createIcon';
import { localeExists } from '../helper/types';
import { getUpdateCheckpoint } from '../helper/updateCheckpoints';
import { schema } from '../helper/schema';
import { createRevisionHash } from '../helper/revision';

export const SkillsUpdate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['skills.update'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      // get checkpoint
      const checkpoint = getUpdateCheckpoint(build.createdAt);

      if(!checkpoint) {
        return `Waiting for Build ${build.id} to be older`;
      }

      const idsToUpdate = (await db.skill.findMany({
        where: { lastCheckedAt: { lt: checkpoint }, removedFromApi: false },
        orderBy: { lastCheckedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      await queueJobForIds('skills.update', idsToUpdate, { priority: 1 });
      return `Queued update for ${idsToUpdate.length} skills (Build ${build.id})`;
    }

    const skillsToUpdate = await db.skill.findMany({
      where: { id: { in: ids }},
      orderBy: { lastCheckedAt: 'asc' },
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
      take: 200,
    });

    if(skillsToUpdate.length === 0) {
      return 'No skills to update';
    }

    // load skills from API
    const apiskills = await loadSkills(skillsToUpdate.map(({ id }) => id));

    const skills = skillsToUpdate.map((existing) => ({
      existing,
      ...apiskills.get(existing.id)
    })).filter(localeExists);

    for(const { existing, de, en, es, fr } of skills) {
      const data_de = JSON.stringify(de);
      const data_en = JSON.stringify(en);
      const data_es = JSON.stringify(es);
      const data_fr = JSON.stringify(fr);

      const revision_de = existing.current_de.data !== data_de ? await db.revision.create({ data: { data: data_de, hash: createRevisionHash(data_de), language: 'de', buildId, type: 'Update', entity: 'Skill', description: 'Updated in API', schema }}) : existing.current_de;
      const revision_en = existing.current_en.data !== data_en ? await db.revision.create({ data: { data: data_en, hash: createRevisionHash(data_en), language: 'en', buildId, type: 'Update', entity: 'Skill', description: 'Updated in API', schema }}) : existing.current_en;
      const revision_es = existing.current_es.data !== data_es ? await db.revision.create({ data: { data: data_es, hash: createRevisionHash(data_es), language: 'es', buildId, type: 'Update', entity: 'Skill', description: 'Updated in API', schema }}) : existing.current_es;
      const revision_fr = existing.current_fr.data !== data_fr ? await db.revision.create({ data: { data: data_fr, hash: createRevisionHash(data_fr), language: 'fr', buildId, type: 'Update', entity: 'Skill', description: 'Updated in API', schema }}) : existing.current_fr;

      const iconId = await createIcon(en.icon);

      await db.skill.update({
        where: { id: existing.id },
        data: {
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          iconId,
          currentId_de: revision_de.id,
          currentId_en: revision_en.id,
          currentId_es: revision_es.id,
          currentId_fr: revision_fr.id,
          lastCheckedAt: new Date(),
          version: 1,
          history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }], skipDuplicates: true }}
        }
      });
    }

    return `Updated ${skills.length} skills`;
  }
};
