import { Prisma, PrismaClient } from '@prisma/client';
import { parseExpression } from 'cron-parser';
import { JobName } from '.';

export async function registerCronJobs(db: PrismaClient) {
  console.log('Registering cron jobs...');

  await registerJob(db, 'test', '0 0 * * *');

  await registerJob(db, 'items.check', '*/5 * * * *');
  await registerJob(db, 'items.update', '*/3 * * * *');
  await registerJob(db, 'items.migrate', '*/6 * * * *');

  await registerJob(db, 'skins.check', '*/5 * * * *');
  await registerJob(db, 'skins.update', '*/3 * * * *');
  await registerJob(db, 'skins.migrate', '*/6 * * * *');

  await registerJob(db, 'jobs.cleanup', '*/15 * * * *');
}

async function registerJob(db: PrismaClient, name: JobName, cron: string, data: Prisma.InputJsonValue = {}) {
  // check if a matching job exists
  const jobs = await db.job.findMany({ where: { type: name, cron: { not: '' } } });

  if(jobs.length === 0) {
    // add new cron job
    console.log(`Registering new cron job ${name}`);

    const scheduledAt = parseExpression(cron, { utc: true }).next().toDate();
    await db.job.create({ data: { type: name, data, cron, scheduledAt } });
    return;
  }

  if(jobs.length === 1) {
    // check if data matches
    if(jobs[0].cron !== cron || JSON.stringify(jobs[0].data) !== JSON.stringify(data)) {
      console.log(`Updating cron job ${name}`);

      const scheduledAt = parseExpression(cron, { utc: true }).next().toDate();
      await db.job.update({ where: { id: jobs[0].id }, data: { data, cron, scheduledAt } });
    }

    return;
  }

  if(jobs.length > 1) {
    console.warn('Found multiple cron jobs for ' + name);
  }
}
