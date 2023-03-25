import 'server-only';
import { Gw2Api } from 'gw2-api-types';
import { ClientItemTooltip } from './ItemTooltip.client';
import { getTranslate } from '../I18n/getTranslate';
import { Language } from '@prisma/client';
import { AsyncComponent } from '@/lib/asyncComponent';
import { format } from 'gw2-tooltip-html';
import { isTruthy } from '@/lib/is';

export interface ItemTooltipProps {
  item: Gw2Api.Item;
  language: Language;
}

export const ItemTooltip: AsyncComponent<ItemTooltipProps> = async ({ item, language }) => {
  const tooltip = await createTooltip(item, language);

  return (
    <ClientItemTooltip tooltip={tooltip}/>
  );
};

export async function createTooltip(item: Gw2Api.Item, language: Language): Promise<ItemTooltip> {
  const t = await getTranslate(language);

  return {
    weaponStrength: item.type === 'Weapon' ? { label: 'Strength', min: item.details?.min_power ?? 0, max: item.details?.max_power ?? 0 } : undefined,
    defense: item.type === 'Armor' ? { label: 'Defense', value: item.details?.defense ?? 0 } : undefined,
    attributes: item.details?.infix_upgrade?.attributes.map((({ attribute, modifier }) => ({ label: t(`attribute.${attribute}`), value: modifier }))),
    bonuses: item.details?.bonuses,
    rarity: { label: item.rarity, value: item.rarity },
    type: item.details?.type,
    weightClass: item.details?.weight_class,
    level: item.level > 0 ? { label: 'Required Level', value: item.level } : undefined,
    description: item.description ? format(item.description) : undefined,
    flags: [
      item.flags.includes('Unique') && 'Unique',
      item.flags.includes('AccountBound') && 'Account Bound',
      item.flags.includes('SoulbindOnAcquire') ? 'Soulbound on Acquire' :
      item.flags.includes('SoulBindOnUse') && 'Soulbound on Use',
      item.flags.includes('NoSalvage') && 'Not salvagable',
      item.flags.includes('NoSell') && 'Not sellable'
    ].filter(isTruthy),
    value: !item.flags.includes('NoSell') ? item.vendor_value : undefined,
  };
}

export interface ItemTooltip {
  weaponStrength?: { label: string, min: number, max: number },
  defense?: { label: string, value: number },
  attributes?: { label: string, value: number }[],
  bonuses?: string[],
  rarity: { label: string, value: Gw2Api.Item['rarity'] },
  type?: string,
  weightClass?: string,
  level?: { label: string, value: number },
  description?: string,
  flags: string[],
  value?: number,
}
