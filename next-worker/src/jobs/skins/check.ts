import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { fetchApi } from '../helper/fetchApi';

export const SkinsCheck: Job = {
  run: async () => {
    // skip if any follow up jobs are still queued
    const queuedJobs = await db.job.count({ where: { type: { in: ['skins.new', 'skins.removed', 'skins.rediscovered'] }, state: { in: ['Queued', 'Running'] }}});

    if(queuedJobs > 0) {
      return 'Waiting for pending follow up jobs';
    }

    // get skin ids from the API
    const ids = await fetchApi<number[]>('/v2/skins');

    // get known ids from the DB
    const knownIds = await db.skin.findMany({ select: { id: true }}).then((skins) => skins.map(({ id }) => id));
    const knownRemovedIds = await db.skin.findMany({ select: { id: true }, where: { removedFromApi: true }}).then((skins) => skins.map(({ id }) => id));

    // Build new ids
    const newIds = ids.filter((id) => !knownIds.includes(id));
    const removedIds = knownIds.filter((id) => !ids.includes(id) && !knownRemovedIds.includes(id));
    const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));

    // queue follow up jobs
    await queueJobForIds('skins.new', newIds);
    await queueJobForIds('skins.removed', removedIds);
    await queueJobForIds('skins.rediscovered', rediscoveredIds);

    return `${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered`;
  }
};
