import { Gw2Api } from 'gw2-api-types';
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

export async function createMigrator() {
  // eslint-disable-next-line require-await
  return async function migrate({ de, en, es, fr }: LocalizedObject<Gw2Api.Currency>, currentVersion = -1) {
    const update: MigratedCurrency = {
      version: CURRENT_VERSION
    };

    return update;
  };
}
