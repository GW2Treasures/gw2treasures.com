import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { loadHomesteadDecorations } from '../helper/loadHomesteadDecorations';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { createIcon } from '../helper/createIcon';
import { toId } from '../helper/toId';

export const HomesteadDecorationsJob: Job = {
  async run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 4;

    if(isEmptyObject(data)) {
      return createSubJobs(
        'homestead.decorations',
        () => fetchApi('/v2/homestead/decorations'),
        db.homesteadDecoration.findMany,
        CURRENT_VERSION
      );
    }

    const knownCategoryIds = (await db.homesteadDecorationCategory.findMany({ select: { id: true }})).map(toId);

    return processLocalizedEntities(
      data,
      'HomesteadDecoration',
      (homesteadDecorationId, revisionId) => ({ homesteadDecorationId_revisionId: { revisionId, homesteadDecorationId }}),
      async (decoration) => {
        const iconId = await createIcon(decoration.en.icon);

        return {
          name_de: decoration.de.name,
          name_en: decoration.en.name,
          name_es: decoration.es.name,
          name_fr: decoration.fr.name,

          maxCount: decoration.en.max_count,

          categoryIds: decoration.en.categories,
          categories: { connect: decoration.en.categories.filter((id) => knownCategoryIds.includes(id)).map((id) => ({ id })) },

          iconId,
        };
      },
      db.homesteadDecoration.findMany,
      loadHomesteadDecorations,
      (tx, data) => tx.homesteadDecoration.create(data),
      (tx, data) => tx.homesteadDecoration.update(data),
      CURRENT_VERSION
    );
  }
};
