import 'server-only';
import type { Gw2Api } from 'gw2-api-types';
import { ClientItemTooltip } from './ItemTooltip.client';
import { getTranslate } from '../I18n/getTranslate';
import type { Item, Language } from '@gw2treasures/database';
import type { AsyncComponent } from '@/lib/asyncComponent';
import { format } from 'gw2-tooltip-html';
import { isTruthy } from '@gw2treasures/ui';
import { getLinkProperties, linkProperties } from '@/lib/linkProperties';
import type { WithIcon } from '@/lib/with';
import type { LocalizedEntity } from '@/lib/localizedName';
import { db } from '@/lib/prisma';
import { parseIcon } from '@/lib/parseIcon';

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

  function mapItemToTooltip(upgrade: Pick<WithIcon<Item>, keyof typeof linkProperties>): ItemWithAttributes {
    const data: Gw2Api.Item = JSON.parse((upgrade as any)[`current_${language}`].data);

    return {
      ...getLinkProperties(upgrade),
      attributes: data.details?.infix_upgrade?.attributes && data.details.infix_upgrade.attributes.length > 0 ? data.details.infix_upgrade.attributes.map((({ attribute, modifier }) => ({ label: t(`attribute.${attribute}`), value: modifier }))) : undefined,
      buff: (!data.details?.infix_upgrade?.attributes || data.details.infix_upgrade.attributes.length === 0) && data.details?.infix_upgrade?.buff?.description ? format(data.details.infix_upgrade.buff.description) : undefined,
      bonuses: data.details?.bonuses?.map(format),
    };
  }

  const upgradeIds = [item.details?.suffix_item_id, item.details?.secondary_suffix_item_id].map(Number).filter(isTruthy);
  const upgrades: ItemTooltip['upgrades'] = upgradeIds.length > 0
    ? (await db.item.findMany({ where: { id: { in: upgradeIds }}, select: { ...linkProperties, [`current_${language}`]: { select: { data: true }}}})).map(mapItemToTooltip)
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

  const infusionIds = item.details?.infusion_slots?.map(({ item_id }) => item_id).map(Number).filter(isTruthy);
  const infusions = infusionIds?.length ? (await db.item.findMany({ where: { id: { in: infusionIds }}, select: { ...linkProperties, [`current_${language}`]: { select: { data: true }}}})).map(mapItemToTooltip) : [];

  return {
    language,
    weaponStrength: item.type === 'Weapon' ? { label: 'Strength', min: item.details?.min_power ?? 0, max: item.details?.max_power ?? 0 } : undefined,
    defense: item.type === 'Armor' ? { label: 'Defense', value: item.details?.defense ?? 0 } : undefined,
    attributes: item.details?.infix_upgrade?.attributes && item.details.infix_upgrade.attributes.length > 0 ? item.details.infix_upgrade.attributes.map((({ attribute, modifier }) => ({ label: t(`attribute.${attribute}`), value: modifier }))) : undefined,
    buff: (!item.details?.infix_upgrade?.attributes || item.details.infix_upgrade.attributes.length === 0) && item.details?.infix_upgrade?.buff?.description ? format(item.details.infix_upgrade.buff.description) : undefined,
    consumable: item.type === 'Consumable' ? { name: item.details?.name, apply_count: item.details?.apply_count, duration_ms: item.details?.duration_ms, description: item.details?.description ? format(item.details.description) : undefined, icon: parseIcon(item.details?.icon) } : undefined,
    bonuses: item.details?.bonuses?.map(format),
    upgrades,
    infusions: item.details?.infusion_slots?.map((infusion) => {
      const item = infusion.item_id && infusions.find(({ id }) => id === Number(infusion.item_id));
      const isEnrichment = infusion.flags?.[0] === 'Enrichment';

      if(item) {
        return {
          type: isEnrichment ? 'Enrichment' : 'Infusion',
          item,
        };
      }

      return {
        type: isEnrichment ? 'Enrichment' : 'Infusion',
        unused: infusion.item_id
          ? (isEnrichment ? `Unknown Enrichment (${infusion.item_id})` : `Unknown Infusion (${infusion.item_id})`)
          : (isEnrichment ? 'Unused Enrichment Slot' : 'Unused Infusion Slot')
      };
    }),
    rarity: { label: t(`rarity.${item.rarity}`), value: item.rarity },
    type: item.details?.type,
    weightClass: item.details?.weight_class,
    level: item.level > 0 ? { label: 'Required Level', value: item.level } : undefined,
    description: item.description ? format(item.description) : undefined,
    flags: [
      item.details?.stat_choices && 'Double-click to select stats.',
      item.flags.includes('Unique') && 'Unique',
      item.flags.includes('AccountBound') && 'Account Bound on Acquire',
      item.flags.includes('SoulbindOnAcquire') ? 'Soulbound on Acquire' :
      item.flags.includes('SoulBindOnUse') && 'Soulbound on Use',
      item.flags.includes('NoSalvage') && 'Not salvagable',
      item.flags.includes('NoSell') && 'Not sellable'
    ].filter(isTruthy),
    value: !item.flags.includes('NoSell') ? item.vendor_value : undefined,
  };
}

export type ItemWithAttributes = WithIcon<LocalizedEntity> & {
  id: number,
  rarity: string,
  attributes?: { label: string, value: number }[],
  buff?: string,
  bonuses?: string[]
}

export interface ItemTooltip {
  language: Language,
  weaponStrength?: { label: string, min: number, max: number },
  defense?: { label: string, value: number },
  attributes?: { label: string, value: number }[],
  buff?: string,
  consumable?: {
    duration_ms?: number,
    apply_count?: number,
    name?: string,
    description?: string,
    icon?: { id: number, signature: string }
  },
  bonuses?: string[],
  upgrades?: (ItemWithAttributes | null)[];
  infusions?: ({
    type: 'Infusion' | 'Enrichment'
  } & ({
    unused: string,
    item?: undefined
  } | {
    unused?: undefined,
    item: ItemWithAttributes
  }))[],
  rarity: { label: string, value: Gw2Api.Item['rarity'] },
  type?: string,
  weightClass?: string,
  level?: { label: string, value: number },
  description?: string,
  flags: string[],
  value?: number,
}
