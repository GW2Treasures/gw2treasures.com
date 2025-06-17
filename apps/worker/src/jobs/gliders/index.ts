import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { Changes, type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { toId } from '../helper/toId';
import { createIcon } from '../helper/createIcon';
import { Prisma } from '@gw2treasures/database';
import { loadLocalizedEntities } from '../helper/load-entities';

const CURRENT_VERSION = 1;

export const GlidersJob: Job = {
  async run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'gliders',
        () => fetchApi('/v2/gliders'),
        db.glider.findMany,
        CURRENT_VERSION
      );
    }

    const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);

    return processLocalizedEntities(
      data,
      'Glider',
      (ids) => loadLocalizedEntities('/v2/gliders', ids),
      (gliderId, revisionId) => ({ gliderId_revisionId: { revisionId, gliderId }}),
      async (glider, version, changes) => {
        const iconId = await createIcon(glider.en.icon);

        const connectOrSet = changes === Changes.New ? 'connect' : 'set';

        return {
          name_de: glider.de.name,
          name_en: glider.en.name,
          name_es: glider.es.name,
          name_fr: glider.fr.name,
          iconId,
          order: glider.en.order,

          unlockedByItemIds: glider.en.unlock_items,
          unlockedByItems: { [connectOrSet]: glider.en.unlock_items?.filter((id) => knownItemIds.includes(id)).map((id) => ({ id })) ?? [] }
        } satisfies Partial<Prisma.GliderUncheckedCreateInput | Prisma.GliderUncheckedUpdateInput>;
      },
      db.glider.findMany,
      (tx, data) => tx.glider.create(data),
      (tx, data) => tx.glider.update(data),
      CURRENT_VERSION
    );
  }
};
