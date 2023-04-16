import { MasteryRegion, Prisma } from '@gw2treasures/database';
import { Gw2Api } from 'gw2-api-types';
import { db } from '../../db';
import { LocalizedObject } from '../helper/types';

function toId<T>({ id }: { id: T }): T {
  return id;
}

export const CURRENT_VERSION = 5;

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

  prerequisitesIds?: number[]
  prerequisites?: Prisma.AchievementUpdateManyWithoutPrerequisiteForNestedInput

  isCategoryDisplay?: boolean
  categoryDisplayFor?: Prisma.AchievementCategoryUpdateManyWithoutCategoryDisplayNestedInput;
}

// eslint-disable-next-line require-await
export async function createMigrator() {
  const achievementIds = (await db.achievement.findMany({ select: { id: true }})).map(toId);
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

    if(currentVersion < 4) {
      const prerequisites = en.prerequisites ?? [];

      update.prerequisitesIds = prerequisites;

      update.prerequisites = { connect: prerequisites.filter((id) => achievementIds.includes(id)).map((id) => ({ id })) };
    }

    if(currentVersion < 5) {
      const isCategoryDisplay = en.flags.includes('CategoryDisplay');
      update.isCategoryDisplay = isCategoryDisplay;

      if(isCategoryDisplay) {
        const categories = await db.achievementCategory.findMany({ where: { achievements: { some: { id: en.id }}}, select: { id: true }});

        update.categoryDisplayFor = { connect: categories };
      }
    }

    return update;
  };
}
