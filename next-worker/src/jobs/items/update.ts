import { Job } from '../job';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadItems } from '../helper/loadItems';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { createIcon } from '../helper/createIcon';
import { localeExists } from '../helper/types';
import { createMigrator } from './migrations';
import { compareRevision } from '../helper/compareRevision';

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

      await queueJobForIds(db, 'items.update', idsToUpdate, 1);
      return `Queued update for ${idsToUpdate.length} items (Build ${build.id})`;
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

    const migrate = await createMigrator();

    let updatedItems = 0;

    for(const { existing, de, en, es, fr } of items) {
      const changes_de = compareRevision(JSON.parse(existing.current_de.data), de);
      const changes_en = compareRevision(JSON.parse(existing.current_en.data), en);
      const changes_es = compareRevision(JSON.parse(existing.current_es.data), es);
      const changes_fr = compareRevision(JSON.parse(existing.current_fr.data), fr);

      if(!changes_de.changed && !changes_en.changed && !changes_es.changed && !changes_fr.changed) {
        // nothing changed
        await db.item.update({ data: { lastCheckedAt: new Date() }, where: { id: existing.id }});
        continue;
      }

      const revision_de = changes_de.changed ? await db.revision.create({ data: { data: JSON.stringify(de), language: 'de', buildId, type: 'Update', entity: 'Item', description: changes_de.description }}) : existing.current_de;
      const revision_en = changes_en.changed ? await db.revision.create({ data: { data: JSON.stringify(en), language: 'en', buildId, type: 'Update', entity: 'Item', description: changes_en.description }}) : existing.current_en;
      const revision_es = changes_es.changed ? await db.revision.create({ data: { data: JSON.stringify(es), language: 'es', buildId, type: 'Update', entity: 'Item', description: changes_es.description }}) : existing.current_es;
      const revision_fr = changes_fr.changed ? await db.revision.create({ data: { data: JSON.stringify(fr), language: 'fr', buildId, type: 'Update', entity: 'Item', description: changes_fr.description }}) : existing.current_fr;

      const iconId = await createIcon(en.icon, db);
      const data = await migrate({ de, en, es, fr });

      await db.item.update({
        where: { id: existing.id },
        data: {
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          iconId,
          rarity: en.rarity,

          ...data,

          currentId_de: revision_de.id,
          currentId_en: revision_en.id,
          currentId_es: revision_es.id,
          currentId_fr: revision_fr.id,
          lastCheckedAt: new Date(),
          history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }], skipDuplicates: true }}
        }
      });

      updatedItems++;
    }

    return `Updated ${updatedItems}/${items.length} items`;
  }
};
