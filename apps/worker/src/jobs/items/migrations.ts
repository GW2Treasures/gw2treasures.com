import { Prisma } from '@gw2treasures/database';
import { db } from '../../db';
import { isDefined, isTruthy } from '@gw2treasures/helper/is';
import { toId } from '../helper/toId';
import { LocalizedObject } from '../helper/types';
import { Item } from '@gw2api/types/data/item';
import { SchemaVersion } from '../helper/schema';

export const CURRENT_VERSION = 12;

/** @see Prisma.ItemUpdateInput */
interface MigratedItem {
  version: number

  name_de?: string
  name_en?: string
  name_es?: string
  name_fr?: string
  type?: string
  subtype?: string | null
  weight?: string | null
  vendorValue?: number | null
  level?: number
  unlocksSkinIds?: number[]
  removedFromApi?: boolean
  lastCheckedAt?: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
  unlocksSkin?: Prisma.SkinCreateNestedManyWithoutUnlockedByItemsInput

  suffixItemIds?: number[]
  suffixItems?: Prisma.ItemUpdateManyWithoutSuffixInNestedInput

  unlocksRecipeIds?: number[]
  unlocksRecipe?: Prisma.RecipeUpdateManyWithoutUnlockedByItemsNestedInput

  unlocksColorIds?: number[]
  unlocksColor?: Prisma.ColorUpdateManyWithoutUnlockedByItemsNestedInput

  unlocksMiniIds?: number[]
  unlocksMinis?: Prisma.MiniUpdateManyWithoutUnlockedByItemsNestedInput

  unlocksGuildUpgradeIds?: number[]
  unlocksGuildUpgrade?: Prisma.GuildUpgradeUpdateManyWithoutUnlockedByItemsNestedInput
}

export async function createMigrator() {
  const knownSkinIds = (await db.skin.findMany({ select: { id: true }})).map(toId);
  const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);
  const knownRecipeIds = (await db.recipe.findMany({ select: { id: true }})).map(toId);
  const knownColorIds = (await db.color.findMany({ select: { id: true }})).map(toId);
  const knownGuildUpgradeIds = (await db.guildUpgrade.findMany({ select: { id: true }})).map(toId);
  const knownMiniIds = (await db.mini.findMany({ select: { id: true }})).map(toId);

  // eslint-disable-next-line require-await
  return async function migrate({ de, en, es, fr }: LocalizedObject<Item<SchemaVersion>>, currentVersion = -1) {
    const update: MigratedItem = {
      version: CURRENT_VERSION
    };

    // Populate common fields
    if(currentVersion <= 0) {
      update.type = en.type;
      update.subtype = en.details?.type;
      update.weight = en.details?.weight_class;
      update.level = Number(en.level);
    }

    // Version 1-4: Add skins
    if(currentVersion < 4) {
      const skins = [en.default_skin, ...(en.details?.skins ?? [])].filter(isDefined).map(Number);

      update.unlocksSkinIds = skins;
      update.unlocksSkin = { connect: skins.filter((id) => knownSkinIds.includes(id)).map((id) => ({ id })) };
    }

    // Version 5: Update name for empty items
    if(currentVersion < 5) {
      if(en.name?.trim() === '') { update.name_en = en.chat_link; }
      if(de.name?.trim() === '') { update.name_de = en.chat_link; }
      if(es.name?.trim() === '') { update.name_es = en.chat_link; }
      if(fr.name?.trim() === '') { update.name_fr = en.chat_link; }
    }

    // Version 6: Add suffix items
    // Version 7: Add slotted infusions as upgrades (2023-03-28)
    if(currentVersion < 7) {
      const suffixItemIds = [en.details?.suffix_item_id, en.details?.secondary_suffix_item_id, ...(en.details?.infusion_slots?.map(({ item_id }) => item_id) || [])].map(Number).filter(isTruthy);

      update.suffixItemIds = suffixItemIds;
      update.suffixItems = { connect: suffixItemIds.filter((id) => knownItemIds.includes(id)).map((id) => ({ id })) };
    }

    // Version 8: Add recipe unlocks
    if(currentVersion < 8) {
      const unlocksRecipes = en.type === 'Consumable' && en.details?.type === 'Unlock' && en.details?.unlock_type === 'CraftingRecipe';
      if(unlocksRecipes) {
        const unlocksRecipeIds = [en.details?.recipe_id, ...(en.details?.extra_recipe_ids || [])].map(Number).filter(isTruthy);

        update.unlocksRecipeIds = unlocksRecipeIds;
        update.unlocksRecipe = { connect: unlocksRecipeIds.filter((id) => knownRecipeIds.includes(id)).map((id) => ({ id })) };
      }
    }

    // Version 9: Add color unlocks
    if(currentVersion < 9) {
      const unlocksColors = en.type === 'Consumable' && en.details?.type === 'Unlock' && en.details?.unlock_type === 'Dye';
      if(unlocksColors) {
        const unlocksColorIds = [en.details?.color_id].filter(isTruthy);

        update.unlocksColorIds = unlocksColorIds;
        update.unlocksColor = { connect: unlocksColorIds.filter((id) => knownColorIds.includes(id)).map((id) => ({ id })) };
      }
    }

    // Version 10: Add guild upgrade unlocks
    if(currentVersion < 10) {
      const unlocksGuildUpgrades = en.type === 'Consumable' && en.details?.type === 'Generic' && en.details?.guild_upgrade_id !== undefined;
      if(unlocksGuildUpgrades) {
        const unlocksGuildUpgradeIds = [en.details?.guild_upgrade_id].filter(isTruthy);

        update.unlocksGuildUpgradeIds = unlocksGuildUpgradeIds;
        update.unlocksGuildUpgrade = { connect: unlocksGuildUpgradeIds.filter((id) => knownGuildUpgradeIds.includes(id)).map((id) => ({ id })) };
      }
    }

    // Version 11: Set vendorValue
    if(currentVersion < 11) {
      update.vendorValue = en.flags.includes('NoSell') ? null : Number(en.vendor_value);
    }

    // Version 12: Unlocks mini
    if(currentVersion < 12) {
      const unlocksMini = en.type === 'MiniPet' && en.details?.minipet_id !== undefined;

      if(unlocksMini) {
        const unlocksMiniIds = [en.details?.minipet_id].filter(isTruthy);

        update.unlocksMiniIds = unlocksMiniIds;
        update.unlocksMinis = { connect: unlocksMiniIds.filter((id) => knownMiniIds.includes(id)).map((id) => ({ id })) };
      }
    }

    return update satisfies Prisma.ItemUpdateInput;
  };
}
