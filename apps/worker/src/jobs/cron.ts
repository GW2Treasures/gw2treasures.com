import { Prisma } from '@gw2treasures/database';
import chalk from 'chalk';
import { CronExpressionParser } from 'cron-parser';
import { JobName } from '.';
import { db } from '../db';
import { toId } from './helper/toId';

export async function registerCronJobs() {
  console.log('Registering cron jobs...');

  await registerJob('test', '0 0 * * *');

  await registerJob('items.check', '*/5 * * * *');
  await registerJob('items.update', '*/3 * * * *');
  await registerJob('items.migrate', '*/6 * * * *');
  await registerJob('items.containerContent', '47 11 * * *');
  await registerJob('items.views', '56 * * * *');
  await registerJob('items.relevancy', '59 * * * *');
  await registerJob('items.legendary-armory', '31 * * * *');

  await registerJob('skills.check', '*/5 * * * *');
  await registerJob('skills.update', '*/3 * * * *');
  await registerJob('skills.migrate', '*/6 * * * *');
  await registerJob('skills.views', '51 * * * *');

  await registerJob('skins', '*/5 * * * *');
  await registerJob('skins.unlocks', '11 * * * *');
  await registerJob('skins.views', '49 * * * *');
  await registerJob('skins.wiki', '53 * * * *');

  await registerJob('achievements', '*/5 * * * *');
  await registerJob('achievements.categories', '*/10 * * * *');
  await registerJob('achievements.groups', '*/10 * * * *');
  await registerJob('achievements.unlocks', '7 * * * *');
  await registerJob('achievements.views', '57 * * * *');

  await registerJob('recipes.check', '*/5 * * * *');
  await registerJob('recipes.update', '*/3 * * * *');
  await registerJob('recipes.migrate', '*/6 * * * *');

  await registerJob('colors', '*/5 * * * *');
  await registerJob('currencies', '*/5 * * * *');
  await registerJob('guild-upgrades', '*/5 * * * *');
  await registerJob('titles', '*/5 * * * *');

  await registerJob('minis', '*/5 * * * *');
  await registerJob('minis.unlocks', '7 * * * *');

  await registerJob('homestead.decorations', '*/5 * * * *');
  await registerJob('homestead.decorations.categories', '*/10 * * * *');
  await registerJob('homestead.glyphs', '*/10 * * * *');
  await registerJob('wizardsvault.season', '*/10 * * * *');
  await registerJob('wizardsvault.listings', '*/5 * * * *');
  await registerJob('wizardsvault.objectives', '13 * * * *');
  await registerJob('wizardsvault.purchase-limit', '47 * * * *');

  await registerJob('tp', '* * * * *');

  await registerJob('gw2api-requests.cleanup', '33 3 * * *');

  await registerJob('icons.colors', '37 * * * *');

  await registerJob('jobs.cleanup', '8 * * * *');
}

async function registerJob(name: JobName, cron: string, data: Prisma.InputJsonValue = {}) {
  // check if a matching job exists
  const jobs = await db.job.findMany({ where: { type: name, cron: { not: '' }}});

  if(jobs.length > 1) {
    console.warn(`Found multiple cron jobs for ${chalk.blue(name)}. Deleting superfluous jobs.`);

    await db.job.deleteMany({ where: { id: { in: jobs.slice(1).map(toId) }}});
  }

  if(jobs.length === 0) {
    // add new cron job
    console.log(`Registering new cron job ${chalk.blue(name)}.`);

    const scheduledAt = CronExpressionParser.parse(cron, { tz: 'utc' }).next().toDate();
    await db.job.create({ data: { type: name, data, cron, scheduledAt }});
    return;
  }

  if(jobs.length >= 1) {
    // check if data matches
    if(jobs[0].cron !== cron || JSON.stringify(jobs[0].data) !== JSON.stringify(data)) {
      console.log(`Updating cron job ${chalk.blue(name)}.`);

      const scheduledAt = CronExpressionParser.parse(cron, { tz: 'utc' }).next().toDate();
      await db.job.update({ where: { id: jobs[0].id }, data: { data, cron, scheduledAt }});
    }

    return;
  }
}
