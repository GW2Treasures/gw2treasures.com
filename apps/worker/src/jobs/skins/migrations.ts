import { Skin } from '@gw2api/types/data/skin';
import { LocalizedObject } from '../helper/types';
import { encode } from 'gw2e-chat-codes';

export const CURRENT_VERSION = 1;

/** @see Prisma.SkinUpdateInput */
interface MigratedSkin {
  version: number

  name_de?: string
  name_en?: string
  name_es?: string
  name_fr?: string
}

// eslint-disable-next-line require-await
export async function createMigrator() {
  // eslint-disable-next-line require-await
  return async function migrate({ de, en, es, fr }: LocalizedObject<Skin>, currentVersion = -1) {
    const update: MigratedSkin = {
      version: CURRENT_VERSION
    };

    // Version 1: Update name for empty skin names
    if(currentVersion < 1) {
      const chatLink = encode('skin', en.id);

      if(chatLink !== false) {
        en.name?.trim() === '' && (update.name_en = chatLink);
        de.name?.trim() === '' && (update.name_de = chatLink);
        es.name?.trim() === '' && (update.name_es = chatLink);
        fr.name?.trim() === '' && (update.name_fr = chatLink);
      }
    }

    return update;
  };
}
