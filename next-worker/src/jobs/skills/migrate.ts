import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { Prisma } from '@prisma/client';

export const CURRENT_VERSION = 1;

export const SkillsMigrate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['skills.migrate'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      const idsToUpdate = (await db.skill.findMany({
        where: { version: { lt: CURRENT_VERSION }},
        orderBy: { updatedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      queueJobForIds('skills.migrate', idsToUpdate, 1);
      return `Queued migration for ${idsToUpdate.length} skills`;
    }

    const skillsToMigrate = await db.skill.findMany({
      where: { id: { in: ids }},
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
    });

    if(skillsToMigrate.length === 0) {
      return 'No skills to update';
    }

    for(const skill of skillsToMigrate) {
      const update: Prisma.SkillUpdateInput = {
        version: CURRENT_VERSION
      };

      await db.skill.update({ where: { id: skill.id }, data: update });
    }

    return `Migrated ${skillsToMigrate.length} skills to version ${CURRENT_VERSION}`;
  }
};
