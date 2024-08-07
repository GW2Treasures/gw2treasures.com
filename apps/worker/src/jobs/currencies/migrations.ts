import { Currency } from '@gw2api/types/data/currency';
import { LocalizedObject } from '../helper/types';

export const CURRENT_VERSION = 0;

/** @see Prisma.CurrencyUpdateInput */
interface MigratedCurrency {
  version: number

  name_de?: string
  name_en?: string
  name_es?: string
  name_fr?: string
  order?: number;
}

// eslint-disable-next-line require-await
export async function createMigrator() {
  // eslint-disable-next-line require-await, @typescript-eslint/no-unused-vars
  return async function migrate({ de, en, es, fr }: LocalizedObject<Currency>, currentVersion = -1) {
    const update: MigratedCurrency = {
      version: CURRENT_VERSION
    };

    return update;
  };
}
