import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { Changes, type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { createIcon } from '../helper/createIcon';
import { encode } from 'gw2e-chat-codes';
import { getNamesWithFallback } from '../helper/helper';
import { loadLocalizedEntities } from '../helper/load-entities';

const CURRENT_VERSION = 3;

export const SkinsJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'skins',
        () => fetchApi('/v2/skins'),
        db.skin.findMany,
        CURRENT_VERSION
      );
    }

    return processLocalizedEntities(
      data,
      'Skin',
      (ids) => loadLocalizedEntities('/v2/skins', ids),
      (skinId, revisionId) => ({ skinId_revisionId: { revisionId, skinId }}),
      async (skin, version, changes) => {
        const iconId = await createIcon(skin.en.icon);

        // fallback to chatlink if name is empty
        const chatLink = encode('skin', skin.en.id) || '';
        const names = getNamesWithFallback(skin, chatLink);

        // for new skins we check if there are known items unlocking it
        const unlockedByItems = changes === Changes.New
          ? { connect: await db.item.findMany({ where: { unlocksSkinIds: { has: skin.en.id }}, select: { id: true }}) }
          : undefined;

        // for new skins we check if there are known achievements bits referencing it
        const achievementBits = changes === Changes.New
          ? { connect: await db.achievement.findMany({ where: { bitsSkinIds: { has: skin.en.id }}, select: { id: true }}) }
          : undefined;

        return {
          ...names,

          rarity: skin.en.rarity,
          type: skin.en.type,
          subtype: skin.en.details?.type,
          weight: skin.en.details?.weight_class,

          iconId,
          unlockedByItems,
          achievementBits,
        };
      },
      db.skin.findMany,
      (tx, data) => tx.skin.create(data),
      (tx, data) => tx.skin.update(data),
      CURRENT_VERSION
    );
  }
};
