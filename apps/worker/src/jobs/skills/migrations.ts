// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Prisma } from '@gw2treasures/database';
import { Gw2Api } from 'gw2-api-types';
import { LocalizedObject } from '../helper/types';

export const CURRENT_VERSION = 2;

/** @see Prisma.SkillUpdateInput  */
interface MigratedSkill {
  version: number

  name_de?: string
  name_en?: string
  name_es?: string
  name_fr?: string
}

// eslint-disable-next-line require-await
export async function createMigrator() {
  // eslint-disable-next-line require-await
  return async function migrate({ de, en, es, fr }: LocalizedObject<Gw2Api.Skill>, currentVersion = -1) {
    const update: MigratedSkill = {
      version: CURRENT_VERSION
    };

    // Version 2: Update name for empty items
    if(currentVersion < 2) {
      en.name?.trim() === '' && (update.name_en = en.chat_link);
      de.name?.trim() === '' && (update.name_de = en.chat_link);
      es.name?.trim() === '' && (update.name_es = en.chat_link);
      fr.name?.trim() === '' && (update.name_fr = en.chat_link);
    }

    return update satisfies Prisma.SkillUpdateInput;
  };
}
