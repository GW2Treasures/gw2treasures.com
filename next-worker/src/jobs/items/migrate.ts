import { Job } from '../job';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { Prisma } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';

export const CURRENT_VERSION = 5;

function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

export const ItemsMigrate: Job = {
  run: async (db, ids: number[] | {}) => {
    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['items.migrate'] }, state: { in: ['Queued', 'Running'] }, cron: null } })

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      const idsToUpdate = (await db.item.findMany({
        where: { version: { lt: CURRENT_VERSION } },
        orderBy: { updatedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      queueJobForIds(db, 'items.migrate', idsToUpdate, 1);
      return `Queued migration for ${idsToUpdate.length} items`;
    }

    const itemsToMigrate = await db.item.findMany({
      where: { id: { in: ids } },
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
    });

    if(itemsToMigrate.length === 0) {
      return 'No items to update';
    }

    const knownSkinIds = (await db.skin.findMany({ select: { id: true }})).map(({ id }) => id);

    for(const item of itemsToMigrate) {
      const data: Gw2Api.Item = JSON.parse(item.current_en.data);
      const dataDe: Gw2Api.Item = JSON.parse(item.current_de.data);
      const dataEs: Gw2Api.Item = JSON.parse(item.current_es.data);
      const dataFr: Gw2Api.Item = JSON.parse(item.current_fr.data);

      const update: Prisma.ItemUpdateInput = {
        version: CURRENT_VERSION
      };

      // Populate common fields
      if(item.version <= 0) {
        update.type = data.type;
        update.subtype = data.details?.type;
        update.weight = data.details?.weight_class;
        update.value = Number(data.vendor_value);
        update.level = Number(data.level);
      }

      // Add unlocked skins (version 2 and 3 skipped)
      if(item.version <= 4) {
        const skins = [data.default_skin, ...(data.details?.skins ?? [])].filter(isDefined).map(Number);

        update.unlocksSkinIds = skins;
        update.unlocksSkin = { set: skins.filter((id) => knownSkinIds.includes(id)).map((id) => ({ id })) };
      }

      // Update name for empty items
      if(item.version <= 5) {
        data.name.trim() === '' && (update.name_en = data.chat_link);
        dataDe.name.trim() === '' && (update.name_de = data.chat_link);
        dataEs.name.trim() === '' && (update.name_es = data.chat_link);
        dataFr.name.trim() === '' && (update.name_fr = data.chat_link);
      }

      await db.item.update({ where: { id: item.id }, data: update });
    }

    return `Migrated ${itemsToMigrate.length} items to version ${CURRENT_VERSION}`;
  }
}
