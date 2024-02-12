import { JobName } from '..';
import { db } from '../../db';

export async function queueJobForIds(name: JobName, ids: number[], { priority = 2, batchSize = 200 }: { priority?: number, batchSize?: number } = {}) {
  if(ids.length === 0) {
    return;
  }

  for(let start = 0; start < ids.length; start += batchSize) {
    await db.job.create({ data: { type: name, data: ids.slice(start, start + batchSize), priority }});
  }
}
