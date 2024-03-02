import type { TypeTranslation } from './ItemType.translations';
import type { SubType, Type, TypeWithSubtype } from './ItemType.types';

export interface ItemTypeProps<T extends Type, S extends SubType<T>> {
  type: T,
  subtype: S,
  display?: 'short' | 'long',
  translations: Record<TypeTranslation<T, S>, string>
}

export function ItemType<T extends Type, S extends SubType<T>>({ type, subtype, translations, display = 'short' }: ItemTypeProps<T, S>) {
  if(display === 'short') {
    return hasSubtype(type, subtype) ? (translations as any)[`item.type.short.${type}.${subtype}`] : (translations as any)[`item.type.${type}`];
  }

  return hasSubtype(type, subtype) ? `${(translations as any)[`item.type.${type}`]} (${(translations as any)[`item.type.${type}.${subtype}`]})` : (translations as any)[`item.type.${type}`];
};

function hasSubtype<T extends Type>(type: T | Type, subtype: SubType<T>): type is TypeWithSubtype {
  return subtype !== null;
}
