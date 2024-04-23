import { Job } from '../job';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { Gw2Api } from 'gw2-api-types';
import { createMigrator, CURRENT_VERSION } from './migrations';
import { toId } from '../helper/toId';

export const CurrenciesMigrate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['currencies.migrate'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      const idsToUpdate = (await db.currency.findMany({
        where: { version: { lt: CURRENT_VERSION }},
        orderBy: { updatedAt: 'asc' },
        select: { id: true }
      })).map(toId);

      queueJobForIds('currencies.migrate', idsToUpdate, { priority: 1 });
      return `Queued migration for ${idsToUpdate.length} currencies`;
    }

    const currenciesToMigrate = await db.currency.findMany({
      where: { id: { in: ids }},
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
    });

    if(currenciesToMigrate.length === 0) {
      return 'No currencies to update';
    }

    const migrate = await createMigrator();

    for(const currency of currenciesToMigrate) {
      const de: Gw2Api.Currency = JSON.parse(currency.current_de.data);
      const en: Gw2Api.Currency = JSON.parse(currency.current_en.data);
      const es: Gw2Api.Currency = JSON.parse(currency.current_es.data);
      const fr: Gw2Api.Currency = JSON.parse(currency.current_fr.data);

      const data = await migrate({ de, en, es, fr }, currency.version);

      await db.currency.update({ where: { id: currency.id }, data });
    }

    return `Migrated ${currenciesToMigrate.length} currencies to version ${CURRENT_VERSION}`;
  }
};
