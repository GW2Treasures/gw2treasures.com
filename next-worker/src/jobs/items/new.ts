import { Job } from '../job';
import fetch from 'node-fetch';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { ApiItem } from '../../apiTypes';
import { loadItems } from '../helper/loadItems';

export const ItemsNew: Job = {
  run: async (db, newIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    // load items from API
    const items = await loadItems(newIds);

    const knownIcons: Record<number, string> = {};

    for(const { de, en, es, fr } of items) {
      const revision_de = await db.revision.create({ data: { data: JSON.stringify(de), language: 'de', buildId, description: 'Added to API' } });
      const revision_en = await db.revision.create({ data: { data: JSON.stringify(en), language: 'en', buildId, description: 'Added to API' } });
      const revision_es = await db.revision.create({ data: { data: JSON.stringify(es), language: 'es', buildId, description: 'Added to API' } });
      const revision_fr = await db.revision.create({ data: { data: JSON.stringify(fr), language: 'fr', buildId, description: 'Added to API' } });

      const icon = en.icon?.match(/\/(?<signature>[^\/]*)\/(?<id>[^\/]*)\.png$/)?.groups as { signature: string, id: number } | undefined;
      
      if(icon) {
        icon.id = Number(icon.id);
      }
  
      if(icon && !knownIcons[icon.id]) {
        try {
          // try to create - might have been created by a different job already, so we don't care if this fails
          await db.icon.create({ data: icon });
        } catch {}
        
        knownIcons[icon.id] = icon.signature;
      } else if(icon && knownIcons[icon.id] !== icon.signature) {
        await db.icon.update({ where: { id: icon.id }, data: icon });
      }
  
      const i = await db.item.create({ data: {
        id: en.id,
        name_de: de.name,
        name_en: en.name,
        name_es: es.name,
        name_fr: fr.name,
        iconId: icon?.id,
        rarity: en.rarity,
        currentId_de: revision_de.id,
        currentId_en: revision_en.id,
        currentId_es: revision_es.id,
        currentId_fr: revision_fr.id,
        history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }]} }
      }});
    }

    return `Added ${items.length} items`; 
  }
}
