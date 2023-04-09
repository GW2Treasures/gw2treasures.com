import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { fetchApi } from '../helper/fetchApi';

export const SkillsCheck: Job = {
  run: async () => {
    // skip if any follow up jobs are still queued
    const queuedJobs = await db.job.count({ where: { type: { in: ['skills.new', 'skills.removed', 'skills.rediscovered', 'skills.import'] }, state: { in: ['Queued', 'Running'] }}});

    if(queuedJobs > 0) {
      return 'Waiting for pending follow up jobs';
    }

    // get skill ids from the API
    const ids = await fetchApi<number[]>('/v2/skills');

    // get known ids from the DB
    const knownIds = await db.skill.findMany({ select: { id: true }}).then((skills) => skills.map(({ id }) => id));
    const knownRemovedIds = await db.skill.findMany({ select: { id: true }, where: { removedFromApi: true }}).then((skills) => skills.map(({ id }) => id));

    // Build new ids
    const newIds = ids.filter((id) => !knownIds.includes(id));
    const removedIds = knownIds.filter((id) => !ids.includes(id) && !knownRemovedIds.includes(id));
    const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));

    // queue follow up jobs
    await queueJobForIds('skills.new', newIds);
    await queueJobForIds('skills.removed', removedIds);
    await queueJobForIds('skills.rediscovered', rediscoveredIds);

    return `${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered`;
  }
};
