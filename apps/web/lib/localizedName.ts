import type { Language } from '@gw2treasures/database';

export interface LocalizedEntity {
  name_de: string;
  name_en: string;
  name_es: string;
  name_fr: string;
}

export function localizedName(entity: LocalizedEntity, language: Language): string {
  return entity[`name_${language}`];
}

export const compareLocalizedName =
  (language: Language) =>
    (a: LocalizedEntity, b: LocalizedEntity) => {
      const nameA = localizedName(a, language);
      const nameB = localizedName(b, language);

      return nameA.localeCompare(nameB, language, { numeric: true, usage: 'sort' });
    };


type PropWithLocaleSuffix<P extends string, T> = Record<`${P}_de` | `${P}_en` | `${P}_es` | `${P}_fr`, T>;

export function selectLocalizedProp<T extends string>(propName: T, language: Language): PropWithLocaleSuffix<T, boolean> {
  return {
    [`${propName}_de`]: language === 'de',
    [`${propName}_en`]: language === 'en',
    [`${propName}_es`]: language === 'es',
    [`${propName}_fr`]: language === 'fr',
  } as PropWithLocaleSuffix<T, boolean>;
}
