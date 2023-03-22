import { Job } from '../job';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadItems } from '../helper/loadItems';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { createIcon } from '../helper/createIcon';
import { localeExists } from '../helper/types';

export const ItemsUpdate: Job = {
  run: async (db, ids: number[] | Record<string, never>) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['items.update'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      // add 15 minutes to timestamp to make sure api cache is updated
      const checkDate = new Date(build.createdAt);
      checkDate.setMinutes(checkDate.getMinutes() + 15);

      const idsToUpdate = (await db.item.findMany({
        where: { lastCheckedAt: { lt: checkDate }, removedFromApi: false },
        orderBy: { lastCheckedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      queueJobForIds(db, 'items.update', idsToUpdate, 1);
      return `Queued update for ${idsToUpdate.length} items`;
    }

    const itemsToUpdate = await db.item.findMany({
      where: { id: { in: ids }},
      orderBy: { lastCheckedAt: 'asc' },
      include: { current_de: true, current_en: true, current_es: true, current_fr: true },
      take: 200,
    });

    if(itemsToUpdate.length === 0) {
      return 'No items to update';
    }

    // load items from API
    const apiItems = await loadItems(itemsToUpdate.map(({ id }) => id));

    const items = itemsToUpdate.map((existing) => ({
      existing,
      ...apiItems.get(existing.id)
    })).filter(localeExists);

    for(const { existing, de, en, es, fr } of items) {
      const revision_de = existing.current_de.data !== JSON.stringify(de) ? await db.revision.create({ data: { data: JSON.stringify(de), language: 'de', buildId, type: 'Update', entity: 'Item', description: 'Updated in API' }}) : existing.current_de;
      const revision_en = existing.current_en.data !== JSON.stringify(en) ? await db.revision.create({ data: { data: JSON.stringify(en), language: 'en', buildId, type: 'Update', entity: 'Item', description: 'Updated in API' }}) : existing.current_en;
      const revision_es = existing.current_es.data !== JSON.stringify(es) ? await db.revision.create({ data: { data: JSON.stringify(es), language: 'es', buildId, type: 'Update', entity: 'Item', description: 'Updated in API' }}) : existing.current_es;
      const revision_fr = existing.current_fr.data !== JSON.stringify(fr) ? await db.revision.create({ data: { data: JSON.stringify(fr), language: 'fr', buildId, type: 'Update', entity: 'Item', description: 'Updated in API' }}) : existing.current_fr;

      const iconId = await createIcon(en.icon, db);

      await db.item.update({
        where: { id: existing.id },
        data: {
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          iconId,
          rarity: en.rarity,
          type: en.type,
          subtype: en.details?.type,
          weight: en.details?.weight_class,
          value: en.vendor_value,
          level: en.level,
          currentId_de: revision_de.id,
          currentId_en: revision_en.id,
          currentId_es: revision_es.id,
          currentId_fr: revision_fr.id,
          lastCheckedAt: new Date(),
          version: 1,
          history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }], skipDuplicates: true }}
        }
      });
    }

    return `Updated ${items.length} items`;
  }
};
