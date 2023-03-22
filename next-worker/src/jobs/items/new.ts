import { Job } from '../job';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadItems } from '../helper/loadItems';
import { createIcon } from '../helper/createIcon';
import { createRevisions } from '../helper/revision';
import { createMigrator } from './migrations';

export const ItemsNew: Job = {
  run: async (db, newIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    // load items from API
    const items = await loadItems(newIds);

    const migrate = await createMigrator();

    for(const [id, { de, en, es, fr }] of items) {
      const revisions = await createRevisions(db, { de, en, es, fr }, { buildId, type: 'Added', entity: 'Item', description: 'Added to API' });
      const data = await migrate({ de, en, es, fr });

      const iconId = await createIcon(en.icon, db);

      await db.item.create({
        data: {
          id,
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          iconId,
          rarity: en.rarity,

          ...data,

          currentId_de: revisions.de.id,
          currentId_en: revisions.en.id,
          currentId_es: revisions.es.id,
          currentId_fr: revisions.fr.id,
          history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }] }}
        }
      });
    }

    return `Added ${items.size} items`;
  }
};
