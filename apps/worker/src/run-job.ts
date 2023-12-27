import { Job } from '@gw2treasures/database';
import chalk from 'chalk';
import { parseExpression } from 'cron-parser';
import { db } from './db';
import { jobs } from './jobs';

export async function runJob(job: Job) {
  const startedAt = new Date();

  // update job in db to state 'Running'
  // add the current job state as where condition, so we can detect if a different worker has already claimed this job
  const q = await db.job.updateMany({ data: { state: 'Running', startedAt }, where: { id: job.id, state: job.state }});

  // if nothing was updated, the job is already claimed
  if(q.count === 0) {
    console.log(chalk.yellow(`Job ${job.id} already claimed by other worker`));
    return;
  }

  console.log(`Running ${chalk.blue(job.type)} ${chalk.gray(`(${job.id})`)}`);

  try {
    // get runner
    const runner = jobs[job.type];

    // throw error if this worker doesn't know the job
    if(!runner) {
      throw new Error(`Unknown job type ${job.type}`);
    }

    // run the job
    const output = await runner.run(job.data as object ?? undefined);

    // store finish timestamp
    const finishedAt = new Date();

    // update job in db
    await db.job.update({
      where: { id: job.id },
      data: { state: 'Success', finishedAt, output: output ?? '' }
    });

    // calculate runtime
    const runtime = finishedAt.valueOf() - startedAt.valueOf();

    // print out output and runtime
    console.log(`${chalk.green('>')} ${output ?? 'Done.'} ${chalk.gray(`(${runtime} ms)`)}`);
  } catch(error) {
    console.error(chalk.red('>'), error);

    // set job as errored in db
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
}

export async function startNewJob(type: string) {
  if(!(type in jobs)) {
    throw new Error(`Unknown job type ${type}`);
  }

  const job = await db.job.create({ data: { type, data: {}, state: 'Running', flags: ['MANUAL_START'] }});

  return await runJob(job);
}
