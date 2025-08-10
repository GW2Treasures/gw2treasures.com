import { Prisma } from '@gw2treasures/database';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { loadLocalizedEntities } from '../helper/load-entities';
import { Changes, type ProcessEntitiesData, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { Job } from '../job';
import { createIcon } from '../helper/createIcon';
import { toId } from '../helper/toId';

const CURRENT_VERSION = 1;

export const TraitsJob: Job = {
  async run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if(isEmptyObject(data)) {
      return createSubJobs(
        'traits',
        () => fetchApi('/v2/traits'),
        db.trait.findMany,
        CURRENT_VERSION
      );
    }

    const knownTraitIds = (await db.trait.findMany({ select: { id: true }})).map(toId);
    const knownSpecializationIds = (await db.specialization.findMany({ select: { id: true }})).map(toId);

    return processLocalizedEntities(
      data,
      'Trait',
      (ids) => loadLocalizedEntities('/v2/traits', ids),
      (traitId, revisionId) => ({ traitId_revisionId: { revisionId, traitId }}),
      async ({ de, en, es, fr }, _, changes) => {
        const connectOrSet = changes === Changes.New ? 'connect' : 'set';

        // we now know about this trait, later traits in the same batch might reference this
        knownTraitIds.push(en.id);

        const iconId = await createIcon(en.icon);

        const affectedByTraitIdsRaw = Array.from(new Set(en.traited_facts?.map(({ requires_trait }) => requires_trait)));

        return {
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,

          iconId,

          specializationIdRaw: en.specialization,
          specializationId: knownSpecializationIds.includes(en.specialization) ? en.specialization : undefined,

          order: en.order,
          tier: en.tier,
          slot: en.slot,

          affectedByTraitIdsRaw,
          affectedByTraits: { [connectOrSet]: affectedByTraitIdsRaw.filter((id) => knownTraitIds.includes(id)).map((id) => ({ id })) },

          // for new traits connect to already existing traits/skills referencing this trait
          affectsTraits: changes === Changes.New || changes === Changes.Migrate
            ? { connect: await db.trait.findMany({ where: { affectedByTraitIdsRaw: { has: en.id }}, select: { id: true }}) }
            : undefined,
          affectsSkills: changes === Changes.New || changes === Changes.Migrate
            ? { connect: await db.skill.findMany({ where: { affectedByTraitIdsRaw: { has: en.id }}, select: { id: true }}) }
            : undefined,
        } satisfies Partial<Prisma.TraitUncheckedCreateInput | Prisma.TraitUncheckedUpdateInput>;
      },
      db.trait.findMany,
      (tx, data) => tx.trait.create(data),
      (tx, data) => tx.trait.update(data),
      CURRENT_VERSION
    );
  }
};
