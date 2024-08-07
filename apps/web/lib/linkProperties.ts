import type { Rarity } from '@gw2treasures/database';
import type { LocalizedEntity } from './localizedName';
import type { WithIcon } from './with';

export const linkPropertiesWithoutRarity = { id: true, icon: true, name_de: true, name_en: true, name_es: true, name_fr: true } as const;
export const linkProperties = { ...linkPropertiesWithoutRarity, rarity: true } as const;

export function getLinkProperties<T extends WithIcon<LocalizedEntity> & { id: unknown, rarity: Rarity }>(value: T): WithIcon<LocalizedEntity> & { id: T['id'], rarity: T['rarity'] };
export function getLinkProperties<T extends WithIcon<LocalizedEntity> & { id: unknown }>(value: T): WithIcon<LocalizedEntity> & { id: T['id'] };
export function getLinkProperties<T extends WithIcon<LocalizedEntity> & { id: unknown, rarity?: Rarity }>(
  { id, name_de, name_en, name_es, name_fr, icon, rarity }: T
): WithIcon<LocalizedEntity> & Pick<T, 'id' | 'rarity'> {
  return { id, name_de, name_en, name_es, name_fr, icon, rarity };
}
