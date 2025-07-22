import { Prisma } from '@gw2treasures/database';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { loadLocalizedEntities } from '../helper/load-entities';
import { type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { Job } from '../job';
import { createIcon } from '../helper/createIcon';

const CURRENT_VERSION = 1;

export const SpecializationsJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'specializations',
        () => fetchApi('/v2/specializations'),
        db.specialization.findMany,
        CURRENT_VERSION
      );
    }

    return processLocalizedEntities(
      data,
      'Specialization',
      (ids) => loadLocalizedEntities('/v2/specializations', ids),
      (specializationId, revisionId) => ({ specializationId_revisionId: { revisionId, specializationId }}),
      async ({ de, en, es, fr }) => {
        const iconId = await createIcon(en.icon);

        return {
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,

          iconId,

          professionId: en.profession,

        } satisfies Partial<Prisma.SpecializationUncheckedCreateInput | Prisma.SpecializationUncheckedUpdateInput>;
      },
      db.specialization.findMany,
      (tx, data) => tx.specialization.create(data),
      (tx, data) => tx.specialization.update(data),
      CURRENT_VERSION
    );
  }
};
