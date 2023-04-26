import { JobName } from '..';
import { db } from '../../db';
import chalk from 'chalk';

export async function queueJobForIds<Id extends number | string>(type: JobName, ids: Id[], priority = 2) {
  if(ids.length === 0) {
    return;
  }

  const batchSize = 200;
  for(let start = 0; start < ids.length; start += batchSize) {
    const data = ids.slice(start, start + batchSize);
    await db.job.create({ data: { type, data, priority }});
    console.log(`Qeueued ${chalk.blue(type)} for ${chalk.magenta(data.length)} ids`);
  }
}
