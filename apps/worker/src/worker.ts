import { db } from './db';
import { runJob } from './run-job';

export const worker = {
  timeout: undefined as (NodeJS.Timeout | undefined),
  lastJob: new Date(),
  shuttingDown: false,

  shutdown() {
    clearTimeout(this.timeout);
    this.shuttingDown = true;
  },

  start() {
    console.log('Waiting for jobs...');
    this.run();
  },

  async run() {
    this.lastJob = new Date();

    const job = await db.job.findFirst({
      where: {
        // scheduledAt in the past
        scheduledAt: { lte: new Date() },

        OR: [
          // queued jobs
          { state: 'Queued' },

          // finished cron job
          { state: { in: ['Error', 'Success'] }, cron: { not: null }}
        ]
      },
      orderBy: [{ priority: 'desc' }, { scheduledAt: 'asc' }]
    });

    if(!job) {
      // no job found, sleeping for 10s
      this.timeout = setTimeout(() => this.run(), 10_000);
      return;
    }

    // run job
    await runJob(job);

    // if not shutting down, queue run again in 1s
    if(!this.shuttingDown) {
      this.timeout = setTimeout(() => this.run(), 1_000);
    } else {
      console.log('Shutting down');
    }
  }
};
