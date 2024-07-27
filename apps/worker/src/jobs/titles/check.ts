import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { fetchApi } from '../helper/fetchApi';
import { toId } from '../helper/toId';

export const TitlesCheck: Job = {
  run: async () => {
    // skip if any follow up jobs are still queued
    const queuedJobs = await db.job.count({ where: { type: { in: ['titles.new', 'titles.removed', 'titles.rediscovered', 'titles.import'] }, state: { in: ['Queued', 'Running'] }}});

    if(queuedJobs > 0) {
      return 'Waiting for pending follow up jobs';
    }

    // get ids from the API
    const ids = await fetchApi('/v2/titles');

    // get known ids from the DB
    const knownIds = (await db.title.findMany({ select: { id: true }})).map(toId);
    const knownRemovedIds = (await db.title.findMany({ select: { id: true }, where: { removedFromApi: true }})).map(toId);

    // Build new ids
    const newIds = ids.filter((id) => !knownIds.includes(id));
    const removedIds = knownIds.filter((id) => !ids.includes(id) && !knownRemovedIds.includes(id));
    const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));

    // queue follow up jobs
    await queueJobForIds('titles.new', newIds);
    await queueJobForIds('titles.removed', removedIds);
    await queueJobForIds('titles.rediscovered', rediscoveredIds);

    return `${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered`;
  }
};
