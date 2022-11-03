// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma, PrismaClient } from '@prisma/client';
import { jobs } from './jobs';
import { registerCronJobs } from './jobs/cron';
import { parseExpression } from 'cron-parser';

let shuttingDown = false;

const db = new PrismaClient();

async function run() {
  if(shuttingDown) {
    return;
  }

  const jobSelector: Prisma.JobWhereInput = {
    OR: [
      // queued jobs
      { state: 'Queued' },

      // finished cron job
      { state: { in: ['Error', 'Success'] }, cron: { not: null } }
    ]
  };

  const job = await db.job.findFirst({
    where: { scheduledAt: { lte: new Date() }, ...jobSelector },
    orderBy: { priority: 'desc' }
  });

  if(!job) {
    // no job found, sleeping
    setTimeout(() => run(), 10000);
    return;
  }

  const q = await db.job.updateMany({ data: { state: 'Running', startedAt: new Date() }, where: { id: job.id, state: job.state } });

  if(q.count === 0) {
    console.log(`Job ${job.id} already claimed by other worker`);
    setTimeout(() => run(), 1000);
    return;
  }

  console.log(`Running ${job.type} (${job.id})`);
  try {
    const runner = jobs[job.type];

    if(!runner) {
      throw new Error(`Unknown job type ${job.type}`);
    }

    const output = await runner.run(db, job.data as object ?? undefined);

    await db.job.update({
      where: { id: job.id },
      data: { state: 'Success', finishedAt: new Date(), output: output ?? '' }
    });
    console.log(`> ${output}`);
  } catch(error) {
    console.error(error);

    await db.job.update({
      where: { id: job.id },
      data: {
        state: 'Error',
        finishedAt: new Date(),
        output: (error as Error).stack || (error as Error).toString() || 'Unknown Error'
      }
    });
  } finally {
    // if the job is a cron job, schedule again
    if(job.cron) {
      const interval = parseExpression(job.cron, { utc: true });

      await db.job.update({
        where: { id: job.id },
        data: { scheduledAt: interval.next().toDate() }
      });
    }
  }

  if(!shuttingDown) {
    setTimeout(() => run(), 1000);
  }
}

registerCronJobs(db);

console.log('Waiting for jobs...');
run();

process.on('SIGTERM', () => {
  console.log('Gracefully shutting down...');
  shuttingDown = true;
});
process.on('SIGINT', () => {
  console.log('Gracefully shutting down...');
  shuttingDown = true;
});
