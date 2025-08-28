import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadItems } from '../helper/loadItems';
import { queueJobForIds } from '../helper/queueJobsForIds';
import { createIcon } from '../helper/createIcon';
import { localeExists } from '../helper/types';
import { createMigrator } from './migrations';
import { getUpdateCheckpoint } from '../helper/updateCheckpoints';
import { schema } from '../helper/schema';
import { createRevisionHash } from '../helper/revision';

export const ItemsUpdate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if(!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['items.update'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if(queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      // get checkpoint
      const checkpoint = getUpdateCheckpoint(build.createdAt);

      if(!checkpoint) {
        return `Waiting for Build ${build.id} to be older`;
      }

      const idsToUpdate = (await db.item.findMany({
        where: { lastCheckedAt: { lt: checkpoint }, removedFromApi: false },
        orderBy: { lastCheckedAt: 'asc' },
        select: { id: true }
      })).map(({ id }) => id);

      await queueJobForIds('items.update', idsToUpdate, { priority: 1 });
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
      const data_de = JSON.stringify(de);
      const data_en = JSON.stringify(en);
      const data_es = JSON.stringify(es);
      const data_fr = JSON.stringify(fr);

      const changed_de = existing.current_de.data !== data_de;
      const changed_en = existing.current_en.data !== data_en;
      const changed_es = existing.current_es.data !== data_es;
      const changed_fr = existing.current_fr.data !== data_fr;

      if(!changed_de && !changed_en && !changed_es && !changed_fr) {
        // nothing changed
        await db.item.update({ data: { lastCheckedAt: new Date() }, where: { id: existing.id }});
        continue;
      }

      const revision_de = changed_de ? await db.revision.create({ data: { data: data_de, hash: createRevisionHash(data_de), language: 'de', buildId, type: 'Update', entity: 'Item', description: 'Updated in API', previousRevisionId: existing.currentId_de, schema }}) : existing.current_de;
      const revision_en = changed_en ? await db.revision.create({ data: { data: data_en, hash: createRevisionHash(data_en), language: 'en', buildId, type: 'Update', entity: 'Item', description: 'Updated in API', previousRevisionId: existing.currentId_en, schema }}) : existing.current_en;
      const revision_es = changed_es ? await db.revision.create({ data: { data: data_es, hash: createRevisionHash(data_es), language: 'es', buildId, type: 'Update', entity: 'Item', description: 'Updated in API', previousRevisionId: existing.currentId_es, schema }}) : existing.current_es;
      const revision_fr = changed_fr ? await db.revision.create({ data: { data: data_fr, hash: createRevisionHash(data_fr), language: 'fr', buildId, type: 'Update', entity: 'Item', description: 'Updated in API', previousRevisionId: existing.currentId_fr, schema }}) : existing.current_fr;

      const iconId = await createIcon(en.icon);
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
