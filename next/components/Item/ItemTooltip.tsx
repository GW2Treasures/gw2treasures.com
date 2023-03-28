import 'server-only';
import { Gw2Api } from 'gw2-api-types';
import { ClientItemTooltip } from './ItemTooltip.client';
import { getTranslate } from '../I18n/getTranslate';
import { Language } from '@prisma/client';
import { AsyncComponent } from '@/lib/asyncComponent';
import { format } from 'gw2-tooltip-html';
import { isTruthy } from '@/lib/is';
import { getLinkProperties, linkProperties } from '@/lib/linkProperties';
import { WithIcon } from '@/lib/with';
import { LocalizedEntity } from '@/lib/localizedName';
import { db } from '@/lib/prisma';

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

  const upgradeIds = [item.details?.suffix_item_id, item.details?.secondary_suffix_item_id].map(Number).filter(isTruthy);
  const upgrades: ItemTooltip['upgrades'] = upgradeIds.length > 0
    ? (await db.item.findMany({ where: { id: { in: upgradeIds }}, select: { ...linkProperties, [`current_${language}`]: { select: { data: true }}}}))
      .map((upgrade) => {
        const data: Gw2Api.Item = JSON.parse((upgrade as any)[`current_${language}`].data);

        return {
          ...getLinkProperties(upgrade),
          attributes: data.details?.infix_upgrade?.attributes && data.details.infix_upgrade.attributes.length > 0 ? data.details.infix_upgrade.attributes.map((({ attribute, modifier }) => ({ label: t(`attribute.${attribute}`), value: modifier }))) : undefined,
          buff: (!data.details?.infix_upgrade?.attributes || data.details.infix_upgrade.attributes.length === 0) && data.details?.infix_upgrade?.buff?.description ? format(data.details.infix_upgrade.buff.description) : undefined,
          bonuses: data.details?.bonuses?.map(format),
        };
      })
    : [];

  if(!item.flags.includes('NotUpgradeable') && ['Armor', 'Back', 'Weapon', 'Trinket'].includes(item.type)) {
    if(upgrades.length === 0) {
      upgrades.push(null);
    }
    if(
      item.type === 'Weapon'
      && (['Greatsword', 'Hammer', 'Longbow', 'Rifle', 'Shortbow', 'Staff'] as Array<string | undefined>).includes(item.details?.type)
      && upgrades.length === 1
    ) {
      upgrades.push(null);
    }
  }

  return {
    language,
    weaponStrength: item.type === 'Weapon' ? { label: 'Strength', min: item.details?.min_power ?? 0, max: item.details?.max_power ?? 0 } : undefined,
    defense: item.type === 'Armor' ? { label: 'Defense', value: item.details?.defense ?? 0 } : undefined,
    attributes: item.details?.infix_upgrade?.attributes && item.details.infix_upgrade.attributes.length > 0 ? item.details.infix_upgrade.attributes.map((({ attribute, modifier }) => ({ label: t(`attribute.${attribute}`), value: modifier }))) : undefined,
    buff: (!item.details?.infix_upgrade?.attributes || item.details.infix_upgrade.attributes.length === 0) && item.details?.infix_upgrade?.buff?.description ? format(item.details.infix_upgrade.buff.description) : undefined,
    bonuses: item.details?.bonuses?.map(format),
    upgrades,
    rarity: { label: t(`rarity.${item.rarity}`), value: item.rarity },
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
  language: Language,
  weaponStrength?: { label: string, min: number, max: number },
  defense?: { label: string, value: number },
  attributes?: { label: string, value: number }[],
  buff?: string,
  bonuses?: string[],
  upgrades?: ((WithIcon<LocalizedEntity> & {
    id: number,
    rarity: string,
    attributes?: { label: string, value: number }[],
    buff?: string,
    bonuses?: string[]
  }) | null)[];
  rarity: { label: string, value: Gw2Api.Item['rarity'] },
  type?: string,
  weightClass?: string,
  level?: { label: string, value: number },
  description?: string,
  flags: string[],
  value?: number,
}
