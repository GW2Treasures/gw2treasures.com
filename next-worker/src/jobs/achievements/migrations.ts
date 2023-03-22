import { MasteryRegion } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';

type Localized<T> = {
  de: T, en: T, es: T, fr: T
}

export const CURRENT_VERSION = 2;

interface MigratedAchievement {
  version: number,

  points?: number;
  mastery?: MasteryRegion | null;
}

// eslint-disable-next-line require-await
export async function createMigrator() {
  // eslint-disable-next-line require-await, @typescript-eslint/no-unused-vars
  return async function migrate({ de, en, es, fr }: Localized<Gw2Api.Achievement>, currentVersion = -1) {
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

    return update;
  };
}
