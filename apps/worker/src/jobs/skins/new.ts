import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadSkins } from '../helper/loadSkins';
import { createIcon } from '../helper/createIcon';
import { createRevisions } from '../helper/revision';
import { createMigrator } from './migrations';

export const skinsNew: Job = {
  run: async (newIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    // load skins from API
    const skins = await loadSkins(newIds);

    const migrate = await createMigrator();

    for(const [id, { de, en, es, fr }] of skins) {
      const revisions = await createRevisions({ de, en, es, fr }, { buildId, type: 'Added', entity: 'Skin', description: 'Added to API' });
      const iconId = await createIcon(en.icon);

      const unlockedByItemIds = await db.item.findMany({ where: { unlocksSkinIds: { has: id }}, select: { id: true }});

      const data = migrate({ de, en, es, fr });

      await db.skin.create({
        data: {
          id,
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          iconId,
          rarity: en.rarity,
          type: en.type,
          subtype: en.details?.type,
          weight: en.details?.weight_class,

          ...data,

          currentId_de: revisions.de.id,
          currentId_en: revisions.en.id,
          currentId_es: revisions.es.id,
          currentId_fr: revisions.fr.id,
          history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }] }},
          unlockedByItems: { connect: unlockedByItemIds }
        }
      });
    }

    return `Added ${skins.size} skins`;
  }
};
