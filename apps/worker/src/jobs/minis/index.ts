import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { Changes, type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { toId } from '../helper/toId';
import { createIcon } from '../helper/createIcon';
import { Prisma } from '@gw2treasures/database';
import { loadLocalizedEntities } from '../helper/load-entities';

const CURRENT_VERSION = 2;

export const MinisJob: Job = {
  async run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'minis',
        () => fetchApi('/v2/minis'),
        db.mini.findMany,
        CURRENT_VERSION
      );
    }

    const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);

    return processLocalizedEntities(
      data,
      'Mini',
      (ids) => loadLocalizedEntities('/v2/minis', ids),
      (miniId, revisionId) => ({ miniId_revisionId: { revisionId, miniId }}),
      async (mini, version, changes) => {
        const iconId = await createIcon(mini.en.icon);

        // if this mini is one of the broken ones, load the item from the hardcoded list
        const brokenItem = mini.en.id in brokenMiniIds
          ? await db.item.findUnique({
              where: { id: brokenMiniIds[mini.en.id] },
              select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true },
            })
          : undefined;

        const itemId = brokenItem?.id ?? mini.en.item_id;

        // get achievements that require this (new) minipet as bit
        // this did not work correctly for version 1, so it also also run as part of version 1 migrations
        const achievementBit = changes === Changes.New || version === 1
          ? await db.achievement.findMany({
              where: { bitsMiniIds: { has: mini.en.id }},
              select: { id: true }
            })
          : [];

        return {
          // the broken minipets just have "((208738))" as name, so we use the item name instead
          name_de: brokenItem?.name_de ?? mini.de.name,
          name_en: brokenItem?.name_en ?? mini.en.name,
          name_es: brokenItem?.name_es ?? mini.es.name,
          name_fr: brokenItem?.name_fr ?? mini.fr.name,
          iconId,

          unlockedByItems: knownItemIds.includes(itemId) ? { connect: { id: itemId }} : undefined,
          achievementBits: { connect: achievementBit },
        } satisfies Partial<Prisma.MiniUncheckedCreateInput>;
      },
      db.mini.findMany,
      (tx, data) => tx.mini.create(data),
      (tx, data) => tx.mini.update(data),
      CURRENT_VERSION
    );
  }
};

// these minis return the wrong itemId/name
const brokenMiniIds: Record<number, number> = {
  747: 90009, //Mini Shrine Guardian
  717: 88464, //Mini Exo-Suit Springer
  715: 88402, //Mini Exo-Suit Raptor
  714: 88437, //Mini Exo-Suit Skimmer
  713: 88469, //Mini Exo-Suit Jackal
  709: 88389, //Mini Exo-Suit Griffon
  699: 87778, //Mini Awakened Raptor
  694: 87753, //Mini Awakened Skimmer
  693: 87626, //Mini Awakened Jackal
  691: 87760, //Mini Awakened Springer
  689: 87934, //Mini Awakened Griffon
  663: 87203, //Mini Branded Skimmer
  662: 87141, //Mini Branded Jackal
  661: 87156, //Mini Branded Springer
  660: 87236, //Mini Branded Raptor
  657: 87133, //Mini Branded Griffon
  655: 86948, //Mini Umbral Demon Skimmer
  654: 86958, //Mini Lucky Lantern Puppy
  653: 86956, //Mini Reforged Warhound Jackal
  652: 86927, //Mini Grand Lion Griffon
  649: 86939, //Mini Summit Wildhorn Springer
  648: 86950, //Mini Resplendent Avialan Raptor
  635: 86581, //Mini Cozy Wintersday Griffon
  633: 86692, //Mini Cozy Wintersday Jackal
  631: 86609, //Mini Cozy Wintersday Skimmer
  629: 86644, //Mini Cozy Wintersday Springer
  627: 86693, //Mini Cozy Wintersday Raptor
  611: 85401, //Mini Spooky Jackal
  610: 85461, //Mini Spooky Griffon
  609: 85458, //Mini Spooky Springer
  605: 85435, //Mini Spooky Raptor
  602: 85517, //Mini Kormeerkat
  599: 85467, //Mini Spooky Skimmer
};
