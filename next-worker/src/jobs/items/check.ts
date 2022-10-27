import { Job } from '../job';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

export const ItemsCheck: Job = {
  run: async (db, data) => {
    // skip if any follow up jobs are still queued
    const queuedJobs = await db.job.count({ where: { type: { in: ['items.new', 'items.removed', 'items.rediscovered'] }, state: { in: ['Queued', 'Running'] } } })

    if(queuedJobs > 0) {
      return 'Waiting for pending follow up jobs';
    }

    // get item ids from the API
    const ids: number[] = await fetch('https://api.guildwars2.com/v2/items').then((r) => r.json());

    // get known ids from the DB
    const knownIds = await db.item.findMany({ select: { id: true } }).then((items) => items.map(({ id }) => id));
    const knownRemovedIds = await db.item.findMany({ select: { id: true }, where: { removedFromApi: true } }).then((items) => items.map(({ id }) => id));
  
    // Build new ids
    const newIds = ids.filter((id) => !knownIds.includes(id));
    const removedIds = knownIds.filter((id) => !ids.includes(id) && !knownRemovedIds.includes(id));
    const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));
  
    // queue follow up jobs
    await queueJobForIds(db, 'items.new', newIds);
    await queueJobForIds(db, 'items.removed', removedIds);
    await queueJobForIds(db, 'items.rediscovered', rediscoveredIds);
    
    return `${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered`;
  }
}

async function queueJobForIds(db: PrismaClient, name: string, ids: number[]) {
  if(ids.length === 0) {
    return;
  }

  const batchSize = 200;
  for(let start = 0; start < ids.length; start += batchSize) {
    await db.job.create({ data: { type: name, data: ids.slice(start, start + batchSize), priority: 2 } });
  }
}
