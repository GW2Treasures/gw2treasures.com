import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { loadHomesteadDecorations } from '../helper/loadHomesteadDecorations';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { createIcon } from '../helper/createIcon';

export const HomesteadDecorationsJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 3;

    if(isEmptyObject(data)) {
      return createSubJobs(
        'homestead.decorations',
        () => fetchApi('/v2/homestead/decorations'),
        db.homesteadDecoration.findMany,
        CURRENT_VERSION
      );
    }

    return processLocalizedEntities(
      data,
      'Color',
      (homesteadDecorationId, revisionId) => ({ homesteadDecorationId_revisionId: { revisionId, homesteadDecorationId }}),
      async (decorations) => {
        const iconId = await createIcon(decorations.en.icon);

        return {
          name_de: decorations.de.name,
          name_en: decorations.en.name,
          name_es: decorations.es.name,
          name_fr: decorations.fr.name,

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
