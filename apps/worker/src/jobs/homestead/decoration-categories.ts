import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { Changes, type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { Prisma } from '@gw2treasures/database';
import { loadLocalizedEntities } from '../helper/load-entities';

export const HomesteadDecorationCategoriesJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if(isEmptyObject(data)) {
      return createSubJobs(
        'homestead.decorations.categories',
        () => fetchApi('/v2/homestead/decorations/categories'),
        db.homesteadDecorationCategory.findMany,
        CURRENT_VERSION
      );
    }

    return processLocalizedEntities(
      data,
      'HomesteadDecorationCategory',
      (ids) => loadLocalizedEntities('/v2/homestead/decorations/categories', ids),
      (homesteadDecorationCategoryId, revisionId) => ({ homesteadDecorationCategoryId_revisionId: { revisionId, homesteadDecorationCategoryId }}),
      async (category, _, change) => {
        return {
          name_de: category.de.name,
          name_en: category.en.name,
          name_es: category.es.name,
          name_fr: category.fr.name,

          decorations: change === Changes.New
            ? { connect: await db.homesteadDecoration.findMany({ where: { categoryIds: { has: category.en.id }}, select: { id: true }}) }
            : undefined
        } satisfies Partial<Prisma.HomesteadDecorationCategoryUncheckedCreateInput>;
      },
      db.homesteadDecorationCategory.findMany,
      (tx, data) => tx.homesteadDecorationCategory.create(data),
      (tx, data) => tx.homesteadDecorationCategory.update(data),
      CURRENT_VERSION
    );
  }
};
