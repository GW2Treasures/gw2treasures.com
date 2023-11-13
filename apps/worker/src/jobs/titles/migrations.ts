import { Gw2Api } from 'gw2-api-types';
import { LocalizedObject } from '../helper/types';

export const CURRENT_VERSION = 0;

/** @see Prisma.TitleUpdateInput */
interface MigratedTitle {
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
  return async function migrate({ de, en, es, fr }: LocalizedObject<Gw2Api.Title>, currentVersion = -1) {
    const update: MigratedTitle = {
      version: CURRENT_VERSION
    };

    return update;
  };
}
