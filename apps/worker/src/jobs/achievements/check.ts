import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { fetchApi } from '../helper/fetchApi';

export const AchievementsCheck: Job = {
  run: async () => {
    // skip if any follow up jobs are still queued
    const queuedJobs = await db.job.count({ where: { type: { in: ['achievements.new', 'achievements.removed', 'achievements.rediscovered'] }, state: { in: ['Queued', 'Running'] }}});

    if(queuedJobs > 0) {
      return 'Waiting for pending follow up jobs';
    }

    // get achievement ids from the API
    const ids = await fetchApi<number[]>('/v2/achievements');

    // get known ids from the DB
    const knownIds = await db.achievement.findMany({ select: { id: true }}).then((achievements) => achievements.map(({ id }) => id));
    const knownRemovedIds = await db.achievement.findMany({ select: { id: true }, where: { removedFromApi: true }}).then((achievements) => achievements.map(({ id }) => id));

    // Build new ids
    const newIds = ids.filter((id) => !knownIds.includes(id));
    const removedIds = knownIds.filter((id) => !ids.includes(id) && !knownRemovedIds.includes(id));
    const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));

    // queue follow up jobs
    await queueJobForIds('achievements.new', newIds);
    await queueJobForIds('achievements.removed', removedIds);
    await queueJobForIds('achievements.rediscovered', rediscoveredIds);

    return `${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered`;
  }
};
