import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { loadOutfits } from '../helper/loadOutfits';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { Changes, type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { toId } from '../helper/toId';
import { createIcon } from '../helper/createIcon';
import { Prisma } from '@gw2treasures/database';

const CURRENT_VERSION = 1;

export const OutfitsJob: Job = {
  async run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'outfits',
        () => fetchApi('/v2/outfits'),
        db.outfit.findMany,
        CURRENT_VERSION
      );
    }

    const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);

    return processLocalizedEntities(
      data,
      'Outfit',
      (outfitId, revisionId) => ({ outfitId_revisionId: { revisionId, outfitId }}),
      async (outfit, version, changes) => {
        const iconId = await createIcon(outfit.en.icon);

        const connectOrSet = changes === Changes.New ? 'connect' : 'set';

        return {
          name_de: outfit.de.name,
          name_en: outfit.en.name,
          name_es: outfit.es.name,
          name_fr: outfit.fr.name,
          iconId,

          unlockedByItemIds: outfit.en.unlock_items,
          unlockedByItems: { [connectOrSet]: outfit.en.unlock_items.filter((id) => knownItemIds.includes(id)).map((id) => ({ id })) }
        } satisfies Partial<Prisma.OutfitUncheckedCreateInput | Prisma.OutfitUncheckedUpdateInput>;
      },
      db.outfit.findMany,
      loadOutfits,
      (tx, data) => tx.outfit.create(data),
      (tx, data) => tx.outfit.update(data),
      CURRENT_VERSION
    );
  }
};
