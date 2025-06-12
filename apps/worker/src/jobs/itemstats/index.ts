import { Prisma } from '@gw2treasures/database';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { loadLocalizedEntities } from '../helper/load-entities';
import { Changes, type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { Job } from '../job';

const CURRENT_VERSION = 1;

export const ItemStatsJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'itemstats',
        () => fetchApi('/v2/itemstats'),
        db.itemStat.findMany,
        CURRENT_VERSION
      );
    }

    return processLocalizedEntities(
      data,
      'ItemStat',
      (ids) => loadLocalizedEntities('/v2/itemstats', ids),
      (itemStatId, revisionId) => ({ itemStatId_revisionId: { revisionId, itemStatId }}),
      async ({ de, en, es, fr }, version, changes) => {
        const connectOrSet = changes === Changes.New ? 'connect' : 'set';

        // find items using the itemstat
        const items = await db.item.findMany({
          where: { itemStatIds: { has: en.id }},
          select: { id: true },
        });

        return {
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,

          attributes: en.attributes as unknown[] as Prisma.InputJsonValue[],

          items: { [connectOrSet]: items }
        } satisfies Partial<Prisma.ItemStatUncheckedCreateInput | Prisma.ItemStatUncheckedUpdateInput>;
      },
      db.itemStat.findMany,
      (tx, data) => tx.itemStat.create(data),
      (tx, data) => tx.itemStat.update(data),
      CURRENT_VERSION
    );
  }
};
