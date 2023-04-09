import { LocalizedEntity } from './localizedName';
import { WithIcon } from './with';

export const linkPropertiesWithoutRarity = { id: true, icon: true, name_de: true, name_en: true, name_es: true, name_fr: true } as const;
export const linkProperties = { ...linkPropertiesWithoutRarity, rarity: true } as const;

export function getLinkProperties<T extends WithIcon<LocalizedEntity> & { id?: unknown, rarity?: string }>(
  { id, name_de, name_en, name_es, name_fr, icon, rarity }: T
): T extends { rarity: string } ? WithIcon<LocalizedEntity> & { id: T['id'], rarity: string } : WithIcon<LocalizedEntity> & { id: T['id'] } {
  return { id, name_de, name_en, name_es, name_fr, icon, rarity } as any;
}
