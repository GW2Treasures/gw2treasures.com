import { Prisma } from '@gw2treasures/database';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { loadLocalizedEntities } from '../helper/load-entities';
import { Changes, type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { Job } from '../job';
import { toId } from '../helper/toId';
import { createIcon } from '../helper/createIcon';

const CURRENT_VERSION = 1;

export const ProfessionsJob: Job = {
  async run(data: ProcessEntitiesData<string> | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'professions',
        () => fetchApi('/v2/professions'),
        db.profession.findMany,
        CURRENT_VERSION
      );
    }

    const knownSkillIds = (await db.skill.findMany({ select: { id: true }})).map(toId);

    return processLocalizedEntities(
      data,
      'Profession',
      (ids) => loadLocalizedEntities('/v2/professions', ids),
      (professionId, revisionId) => ({ professionId_revisionId: { revisionId, professionId }}),
      async ({ de, en, es, fr }, version, changes) => {
        const connectOrSet = changes === Changes.New ? 'connect' : 'set';

        const iconId = await createIcon(en.icon);
        const iconBigId = await createIcon(en.icon_big);

        const skillIds = [
          ...en.skills.map((skill) => skill.id),
          ...Object.values(en.weapons).flatMap((weapon) => weapon.skills.map((skill) => skill.id))
        ];

        return {
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,

          iconId,
          iconBigId,

          skillIds,
          skills: { [connectOrSet]: skillIds.filter((id) => knownSkillIds.includes(id)).map((id) => ({ id })) }
        } satisfies Partial<Prisma.ProfessionUncheckedCreateInput | Prisma.ProfessionUncheckedUpdateInput>;
      },
      db.profession.findMany,
      (tx, data) => tx.profession.create(data),
      (tx, data) => tx.profession.update(data),
      CURRENT_VERSION
    );
  }
};
