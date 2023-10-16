import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { Gw2Api } from 'gw2-api-types';
import { createMigrator, CURRENT_VERSION } from './migrations';
import { toId } from '../helper/toId';

export const titlesMigrate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['titles.migrate'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      const idsToUpdate = (await db.title.findMany({
        where: { version: { lt: CURRENT_VERSION }},
        orderBy: { updatedAt: 'asc' },
        select: { id: true }
      })).map(toId);

      queueJobForIds('titles.migrate', idsToUpdate, 1);
      return `Queued migration for ${idsToUpdate.length} titles`;
    }

    const titlesToMigrate = await db.title.findMany({
      where: { id: { in: ids }},
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
    });

    if(titlesToMigrate.length === 0) {
      return 'No titles to update';
    }

    const migrate = await createMigrator();

    for(const title of titlesToMigrate) {
      const de: Gw2Api.Title = JSON.parse(title.current_de.data);
      const en: Gw2Api.Title = JSON.parse(title.current_en.data);
      const es: Gw2Api.Title = JSON.parse(title.current_es.data);
      const fr: Gw2Api.Title = JSON.parse(title.current_fr.data);

      const data = await migrate({ de, en, es, fr }, title.version);

      await db.title.update({ where: { id: title.id }, data });
    }

    return `Migrated ${titlesToMigrate.length} titles to version ${CURRENT_VERSION}`;
  }
};
