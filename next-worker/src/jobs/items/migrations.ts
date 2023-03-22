import { Prisma } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';
import { db } from '../../db';

type Localized<T> = {
  de: T, en: T, es: T, fr: T
}

function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

export const CURRENT_VERSION = 5;

interface MigratedItem {
  version: number

  name_de?: string
  name_en?: string
  name_es?: string
  name_fr?: string
  type?: string
  subtype?: string | null
  weight?: string | null
  value?: number
  level?: number
  unlocksSkinIds?: number[]
  removedFromApi?: boolean
  lastCheckedAt?: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
  unlocksSkin?: Prisma.SkinCreateNestedManyWithoutUnlockedByItemsInput
}

export async function createMigrator() {
  const knownSkinIds = (await db.skin.findMany({ select: { id: true }})).map(({ id }) => id);

  // eslint-disable-next-line require-await
  return async function migrate({ de, en, es, fr }: Localized<Gw2Api.Item>, currentVersion = -1) {
    const update: MigratedItem = {
      version: CURRENT_VERSION
    };

    // Populate common fields
    if(currentVersion <= 0) {
      update.type = en.type;
      update.subtype = en.details?.type;
      update.weight = en.details?.weight_class;
      update.value = Number(en.vendor_value);
      update.level = Number(en.level);
    }

    // Add unlocked skins (version 2 and 3 skipped)
    if(currentVersion <= 4) {
      const skins = [en.default_skin, ...(en.details?.skins ?? [])].filter(isDefined).map(Number);

      update.unlocksSkinIds = skins;
      update.unlocksSkin = { connect: skins.filter((id) => knownSkinIds.includes(id)).map((id) => ({ id })) };
    }

    // Update name for empty items
    if(currentVersion <= 5) {
      en.name?.trim() === '' && (update.name_en = en.chat_link);
      de.name?.trim() === '' && (update.name_de = en.chat_link);
      es.name?.trim() === '' && (update.name_es = en.chat_link);
      fr.name?.trim() === '' && (update.name_fr = en.chat_link);
    }

    return update;
  };
}
