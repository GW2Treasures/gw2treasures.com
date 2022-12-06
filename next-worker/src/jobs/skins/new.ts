import { Job } from '../job';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadSkins } from '../helper/loadSkins';
import { CURRENT_VERSION } from './migrate';
import { createIcon } from '../helper/createIcon';
import { createRevisions } from '../helper/revision';

export const skinsNew: Job = {
  run: async (db, newIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    // load skins from API
    const skins = await loadSkins(newIds);

    for(const { de, en, es, fr } of skins) {
      const revisions = await createRevisions(db, { de, en, es, fr }, { buildId, type: 'Added', entity: 'Skin', description: 'Added to API' });
      const iconId = await createIcon(en.icon, db);

      const unlockedByItemIds = await db.item.findMany({ where: { unlocksSkinIds: { has: en.id } }, select: { id: true }});

      await db.skin.create({ data: {
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
        version: CURRENT_VERSION,
        currentId_de: revisions.de.id,
        currentId_en: revisions.en.id,
        currentId_es: revisions.es.id,
        currentId_fr: revisions.fr.id,
        history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }]} },
        unlockedByItems: { connect: unlockedByItemIds }
      }});
    }

    return `Added ${skins.length} skins`;
  }
}
