import { Job } from '../job';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadItems } from '../helper/loadItems';
import { createIcon } from '../helper/createIcon';
import { createRevisions } from '../helper/revision';

export const ItemsNew: Job = {
  run: async (db, newIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    // load items from API
    const items = await loadItems(newIds);

    for(const { de, en, es, fr } of items) {
      const revisions = await createRevisions(db, { de, en, es, fr }, { buildId, type: 'Added', entity: 'Item', description: 'Added to API' });

      const iconId = await createIcon(en.icon, db);

      await db.item.create({ data: {
        id: en.id,
        name_de: de.name,
        name_en: en.name,
        name_es: es.name,
        name_fr: fr.name,
        iconId: iconId,
        rarity: en.rarity,
        type: en.type,
        subtype: en.details?.type,
        weight: en.details?.weight_class,
        value: en.vendor_value,
        level: en.level,
        version: 1,
        currentId_de: revisions.de.id,
        currentId_en: revisions.en.id,
        currentId_es: revisions.es.id,
        currentId_fr: revisions.fr.id,
        history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }]} }
      }});
    }

    return `Added ${items.length} items`;
  }
}
