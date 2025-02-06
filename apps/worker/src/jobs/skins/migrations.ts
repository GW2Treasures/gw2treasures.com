import { Skin } from '@gw2api/types/data/skin';
import { LocalizedObject } from '../helper/types';
import { encode } from 'gw2e-chat-codes';
import { db } from '../../db';
import { Prisma } from '@gw2treasures/database';

export const CURRENT_VERSION = 3;

/** @see Prisma.SkinUpdateInput */
interface MigratedSkin {
  version: number

  name_de?: string
  name_en?: string
  name_es?: string
  name_fr?: string

  achievementBits?: Prisma.AchievementUpdateManyWithoutBitsSkinNestedInput
  unlockedByItems?: Prisma.ItemUpdateManyWithoutUnlocksSkinNestedInput
}

// eslint-disable-next-line require-await
export async function createMigrator() {
  return async function migrate({ de, en, es, fr }: LocalizedObject<Skin>, currentVersion = -1) {
    const update: MigratedSkin = {
      version: CURRENT_VERSION
    };

    // Version 1: Update name for empty skin names
    // Version 3: Update name for empty skin names (include undefined)
    if(currentVersion < 3) {
      const chatLink = encode('skin', en.id);

      if(chatLink !== false) {
        if(!en.name || en.name.trim() === '') { update.name_en = chatLink; }
        if(!de.name || de.name.trim() === '') { update.name_de = chatLink; }
        if(!es.name || es.name.trim() === '') { update.name_es = chatLink; }
        if(!fr.name || fr.name.trim() === '') { update.name_fr = chatLink; }
      }
    }

    // Version 2: Connect to achievements (bits) and items (if achievement/item existed before skin)
    if(currentVersion < 2) {
      const [achievementBits, unlockedByItems] = await Promise.all([
        db.achievement.findMany({ where: { bitsSkinIds: { has: en.id }}, select: { id: true }}),
        db.item.findMany({ where: { unlocksSkinIds: { has: en.id }}, select: { id: true }})
      ]);

      if(achievementBits.length > 0) {
        update.achievementBits = { connect: achievementBits };
      }

      if(unlockedByItems.length > 0) {
        update.unlockedByItems = { connect: unlockedByItems };
      }
    }

    return update satisfies Prisma.SkinUpdateInput;
  };
}
