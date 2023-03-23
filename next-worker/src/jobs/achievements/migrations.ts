import { MasteryRegion, Prisma } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';
import { db } from '../../db';
import { LocalizedObject } from '../helper/types';

function toId<T>({ id }: { id: T }): T {
  return id;
}

export const CURRENT_VERSION = 3;

/** @see Prisma.AchievementUpdateInput */
interface MigratedAchievement {
  version: number

  points?: number
  mastery?: MasteryRegion | null

  bitsItemIds?: number[]
  bitsSkinIds?: number[]
  rewardsItemIds?: number[]

  bitsItem?: Prisma.ItemCreateNestedManyWithoutAchievementBitsInput
  bitsSkin?: Prisma.SkinCreateNestedManyWithoutAchievementBitsInput
  rewardsItem?: Prisma.ItemCreateNestedManyWithoutAchievementRewardsInput
}

// eslint-disable-next-line require-await
export async function createMigrator() {
  const itemIds = (await db.item.findMany({ select: { id: true }})).map(toId);
  const skinIds = (await db.skin.findMany({ select: { id: true }})).map(toId);

  // eslint-disable-next-line require-await, @typescript-eslint/no-unused-vars
  return async function migrate({ de, en, es, fr }: LocalizedObject<Gw2Api.Achievement>, currentVersion = -1) {
    const update: MigratedAchievement = {
      version: CURRENT_VERSION
    };

    if(currentVersion < 1) {
      update.points = en.tiers.reduce((total, tier) => total + tier.points, 0);
    }

    if(currentVersion < 2) {
      const mastery = en.rewards?.find(({ type }) => type === 'Mastery');
      update.mastery = mastery ? mastery.region : null;
    }

    if(currentVersion < 3) {
      const itemBits = en.bits?.filter(({ type }) => type === 'Item').map(toId) ?? [];
      const skinBits = en.bits?.filter(({ type }) => type === 'Skin').map(toId) ?? [];
      const itemRewards = en.rewards?.filter(({ type }) => type === 'Item').map(toId) ?? [];

      update.bitsItemIds = itemBits;
      update.bitsSkinIds = skinBits;
      update.rewardsItemIds = itemRewards;

      update.bitsItem = { connect: itemBits.filter((id) => itemIds.includes(id)).map((id) => ({ id })) };
      update.bitsSkin = { connect: skinBits.filter((id) => skinIds.includes(id)).map((id) => ({ id })) };
      update.rewardsItem = { connect: itemRewards.filter((id) => itemIds.includes(id)).map((id) => ({ id })) };
    }

    return update;
  };
}
