export interface LocalizedEntity {
  name_de: string;
  name_en: string;
  name_es: string;
  name_fr: string;
}

export function localizedName(entity: LocalizedEntity, language: 'de' | 'en' | 'es' | 'fr'): string {
  return entity[`name_${language}`];
}
