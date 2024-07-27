import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { fetchApi } from '../helper/fetchApi';
import { toId } from '../helper/toId';

export const CurrenciesCheck: Job = {
  run: async () => {
    // skip if any follow up jobs are still queued
    const queuedJobs = await db.job.count({ where: { type: { in: ['currencies.new', 'currencies.removed', 'currencies.rediscovered', 'currencies.import'] }, state: { in: ['Queued', 'Running'] }}});

    if(queuedJobs > 0) {
      return 'Waiting for pending follow up jobs';
    }

    // get ids from the API
    const ids = await fetchApi('/v2/currencies');

    // get known ids from the DB
    const knownIds = (await db.currency.findMany({ select: { id: true }})).map(toId);
    const knownRemovedIds = (await db.currency.findMany({ select: { id: true }, where: { removedFromApi: true }})).map(toId);

    // Build new ids
    const newIds = ids.filter((id) => !knownIds.includes(id));
    const removedIds = knownIds.filter((id) => !ids.includes(id) && !knownRemovedIds.includes(id));
    const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));

    // queue follow up jobs
    await queueJobForIds('currencies.new', newIds);
    await queueJobForIds('currencies.removed', removedIds);
    await queueJobForIds('currencies.rediscovered', rediscoveredIds);

    return `${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered`;
  }
};
