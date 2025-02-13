import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { loadTitles } from '../helper/loadTitles';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { Changes, type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { getNamesWithFallback } from '../helper/helper';

const CURRENT_VERSION = 0;

export const TitlesJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'titles',
        () => fetchApi('/v2/titles'),
        db.title.findMany,
        CURRENT_VERSION
      );
    }

    return processLocalizedEntities(
      data,
      'Title',
      (titleId, revisionId) => ({ titleId_revisionId: { revisionId, titleId }}),
      async (title, version, changes) => {
        const names = getNamesWithFallback(title);

        // for new titles we check if there are known achievements granting it
        const achievements = changes === Changes.New
          ? { connect: await db.achievement.findMany({ where: { rewardsTitleIds: { has: title.en.id }}, select: { id: true }}) }
          : undefined;

        return {
          ...names,
          achievements,
        };
      },
      db.title.findMany,
      loadTitles,
      (tx, data) => tx.title.create(data),
      (tx, data) => tx.title.update(data),
      CURRENT_VERSION
    );
  }
};
