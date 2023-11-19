import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { loadColors } from '../helper/loadColors';
import { isEmptyObject } from '../helper/is';
import { type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entitites';

interface ColorsJobProps extends ProcessEntitiesData<number> {}

export const ColorsJob: Job = {
  run(data: ColorsJobProps | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if(isEmptyObject(data)) {
      return createSubJobs(
        'colors',
        () => fetchApi<number[]>('/v2/colors'),
        db.color.findMany,
        CURRENT_VERSION
      );
    }

    return processLocalizedEntities(
      data,
      'Color',
      (colorId, revisionId) => ({ colorId_revisionId: { revisionId, colorId }}),
      (colors) => ({ name_de: colors.de.name, name_en: colors.en.name, name_es: colors.es.name, name_fr: colors.fr.name }),
      db.color.findMany,
      loadColors,
      (tx, data) => tx.color.upsert(data),
      CURRENT_VERSION
    );
  }
};
