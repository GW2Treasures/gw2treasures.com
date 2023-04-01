import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { fetchApi } from '../helper/fetchApi';

export const ItemsCheck: Job = {
  run: async () => {
    // skip if any follow up jobs are still queued
    const queuedJobs = await db.job.count({ where: { type: { in: ['items.new', 'items.removed', 'items.rediscovered', 'items.import'] }, state: { in: ['Queued', 'Running'] }}});

    if(queuedJobs > 0) {
      return 'Waiting for pending follow up jobs';
    }

    // get item ids from the API
    const ids = await fetchApi<number[]>('/v2/items');

    // get known ids from the DB
    const knownIds = await db.item.findMany({ select: { id: true }}).then((items) => items.map(({ id }) => id));
    const knownRemovedIds = await db.item.findMany({ select: { id: true }, where: { removedFromApi: true }}).then((items) => items.map(({ id }) => id));

    // Build new ids
    const newIds = ids.filter((id) => !knownIds.includes(id));
    const removedIds = knownIds.filter((id) => !ids.includes(id) && !knownRemovedIds.includes(id));
    const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));

    // queue follow up jobs
    await queueJobForIds('items.new', newIds);
    await queueJobForIds('items.removed', removedIds);
    await queueJobForIds('items.rediscovered', rediscoveredIds);

    return `${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered`;
  }
};
