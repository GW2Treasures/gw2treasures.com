import { Prisma } from '@gw2treasures/database';
import { LocalizedObject } from '../helper/types';
import { Skill } from '@gw2api/types/data/skill';
import { db } from '../../db';
import { toId } from '../helper/toId';

export const CURRENT_VERSION = 4;

/** @see Prisma.SkillUpdateInput  */
interface MigratedSkill {
  version: number

  name_de?: string
  name_en?: string
  name_es?: string
  name_fr?: string

  affectedByTraits?: { connect: { id: number }[] }
  affectedByTraitIdsRaw?: number[]

  flags?: string[]
}

export async function createMigrator() {
  // get all known trait ids
  const knownTraitIds = (await db.trait.findMany({ select: { id: true }})).map(toId);

  // eslint-disable-next-line require-await
  return async function migrate({ de, en, es, fr }: LocalizedObject<Skill>, currentVersion = -1) {
    const update: MigratedSkill = {
      version: CURRENT_VERSION
    };

    // Version 2: Update name for empty items
    if(currentVersion < 2) {
      if(en.name?.trim() === '') { update.name_en = en.chat_link; }
      if(de.name?.trim() === '') { update.name_de = en.chat_link; }
      if(es.name?.trim() === '') { update.name_es = en.chat_link; }
      if(fr.name?.trim() === '') { update.name_fr = en.chat_link; }
    }

    // Version 3: Add flags
    update.flags = en.flags;

    // Version 4: Add trait relations
    if(currentVersion < 4) {
      update.affectedByTraitIdsRaw = Array.from(new Set(en.traited_facts?.map(({ requires_trait }) => requires_trait)));
      update.affectedByTraits = update.affectedByTraitIdsRaw.length === 0 ? undefined : {
        connect: update.affectedByTraitIdsRaw
          .filter((id) => knownTraitIds.includes(id))
          .map((id) => ({ id }))
      };
    }

    return update satisfies Prisma.SkillUpdateInput;
  };
}
