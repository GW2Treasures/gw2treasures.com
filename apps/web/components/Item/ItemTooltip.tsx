import 'server-only';
import type { Gw2Api } from 'gw2-api-types';
import { ClientItemTooltip } from './ItemTooltip.client';
import { getTranslate } from '@/lib/translate';
import type { Item, Language, Rarity } from '@gw2treasures/database';
import { format } from 'gw2-tooltip-html';
import { isTruthy } from '@gw2treasures/helper/is';
import { getLinkProperties, linkProperties } from '@/lib/linkProperties';
import type { WithIcon } from '@/lib/with';
import { localizedName, type LocalizedEntity } from '@/lib/localizedName';
import { db } from '@/lib/prisma';
import { parseIcon } from '@/lib/parseIcon';
import type { FC } from 'react';

export interface ItemTooltipProps {
  item: Gw2Api.Item;
  language: Language;
  hideTitle?: boolean;
}

export const ItemTooltip: FC<ItemTooltipProps> = async ({ item, language, hideTitle }) => {
  const tooltip = await createTooltip(item, language);

  return (
    <ClientItemTooltip tooltip={tooltip} hideTitle={hideTitle}/>
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

  // get upgrades
  const upgradeIds = [item.details?.suffix_item_id, item.details?.secondary_suffix_item_id].map(Number).filter(isTruthy);
  const upgrades: ItemTooltip['upgrades'] = upgradeIds.length > 0
    ? (await db.item.findMany({ where: { id: { in: upgradeIds }}, select: { ...linkProperties, [`current_${language}`]: { select: { data: true }}}})).map(mapItemToTooltip).map((item) => ({ item }))
    : [];

  // get empty upgrades
  if(!item.flags.includes('NotUpgradeable') && ['Armor', 'Back', 'Weapon', 'Trinket'].includes(item.type)) {
    if(upgrades.length === 0) {
      upgrades.push({ unused: t('item.upgrade.empty') });
    }
    if(
      item.type === 'Weapon'
      && (['Greatsword', 'Hammer', 'Longbow', 'Rifle', 'Shortbow', 'Staff'] as Array<string | undefined>).includes(item.details?.type)
      && upgrades.length === 1
    ) {
      upgrades.push({ unused: t('item.upgrade.empty') });
    }
  }

  // get infusion slots
  const infusionIds = item.details?.infusion_slots?.map(({ item_id }) => item_id).map(Number).filter(isTruthy);
  const infusionItems = infusionIds?.length ? (await db.item.findMany({ where: { id: { in: infusionIds }}, select: { ...linkProperties, [`current_${language}`]: { select: { data: true }}}})).map(mapItemToTooltip) : [];
  const infusions = item.details?.infusion_slots?.map<ItemTooltipInfusion>((infusion) => {
    const item = infusion.item_id && infusionItems.find(({ id }) => id === Number(infusion.item_id));
    const isEnrichment = infusion.flags?.[0] === 'Enrichment';
    const type = isEnrichment ? 'Enrichment' : 'Infusion';

    if(item) {
      return { type, item };
    }

    return {
      type: isEnrichment ? 'Enrichment' : 'Infusion',
      unused: infusion.item_id
        ? (isEnrichment ? `Unknown Enrichment (${infusion.item_id})` : `Unknown Infusion (${infusion.item_id})`)
        : (isEnrichment ? t('item.infusion.emptyEnrichment') : t('item.infusion.emptyInfusion'))
    };
  });

  // get unlocked color
  const unlocksColor = item.type === 'Consumable' && item.details?.type === 'Unlock' && item.details.unlock_type === 'Dye' && item.details.color_id
    ? await db.color.findUnique({ where: { id: Number(item.details.color_id) }})
    : undefined;

  // get item icon
  const icon = parseIcon(item.icon);

  return {
    language,
    name: item.name,
    icon,
    weaponStrength: item.type === 'Weapon'
      ? { label: t('item.strength'), min: item.details?.min_power ?? 0, max: item.details?.max_power ?? 0 }
      : undefined,
    defense: item.type === 'Armor'
      ? { label: t('item.defense'), value: item.details?.defense ?? 0 }
      : undefined,
    attributes: item.details?.infix_upgrade?.attributes && item.details.infix_upgrade.attributes.length > 0
      ? item.details.infix_upgrade.attributes.map((({ attribute, modifier }) => ({ label: t(`attribute.${attribute}`), value: modifier })))
      : undefined,
    buff: (!item.details?.infix_upgrade?.attributes || item.details.infix_upgrade.attributes.length === 0) && item.details?.infix_upgrade?.buff?.description
      ? format(item.details.infix_upgrade.buff.description)
      : undefined,
    consumable: item.type === 'Consumable' && item.details
      ? { label: t('item.consume'), name: item.details.name, apply_count: item.details.apply_count, duration_ms: item.details.duration_ms, description: formatMarkup(item.details.description), icon: parseIcon(item.details.icon) }
      : undefined,
    bonuses: item.details?.bonuses?.map(format),
    upgrades: upgrades.length > 0 ? upgrades : undefined,
    infusions,
    unlocksColor: unlocksColor ? { id: unlocksColor.id, name: localizedName(unlocksColor, language), colors: { cloth: unlocksColor.cloth_rgb, leather: unlocksColor.leather_rgb, metal: unlocksColor.metal_rgb }} : undefined,
    rarity: { label: t(`rarity.${item.rarity}`), value: item.rarity },
    type: item.details?.type,
    weightClass: item.details?.weight_class,
    level: item.level > 0 ? { label: t('item.level'), value: item.level } : undefined,
    description: item.description ? format(item.description) : undefined,
    flags: [
      item.details?.stat_choices && t('item.selectStats'),
      item.flags.includes('Unique') && t('item.flag.Unique'),
      item.flags.includes('AccountBound') && t('item.flag.AccountBound'),
      item.flags.includes('SoulbindOnAcquire') ? t('item.flag.SoulbindOnAcquire') :
      item.flags.includes('SoulBindOnUse') && t('item.flag.SoulBindOnUse'),
      item.flags.includes('NoSalvage') && t('item.flag.NoSalvage'),
      item.flags.includes('NoSell') && t('item.flag.NoSell'),
    ].filter(isTruthy),
    vendorValue: !item.flags.includes('NoSell') ? item.vendor_value : undefined,
  };
}

function formatMarkup(value: string | undefined) {
  return value ? format(value) : undefined;
}

export type ItemWithAttributes = WithIcon<LocalizedEntity> & {
  id: number,
  rarity: Rarity,
  attributes?: { label: string, value: number }[],
  buff?: string,
  bonuses?: string[]
}

export type ItemTooltipInfusion = ({
  type: 'Infusion' | 'Enrichment'
} & ({
  unused: string,
  item?: never
} | {
  unused?: never,
  item: ItemWithAttributes
}))

export interface ItemTooltip {
  language: Language,
  name: string,
  icon?: { id: number, signature: string },
  weaponStrength?: { label: string, min: number, max: number },
  defense?: { label: string, value: number },
  attributes?: { label: string, value: number }[],
  buff?: string,
  consumable?: {
    label: string,
    duration_ms?: number,
    apply_count?: number,
    name?: string,
    description?: string,
    icon?: { id: number, signature: string }
  },
  bonuses?: string[],
  upgrades?: ({ item: ItemWithAttributes, unused?: never }| { item?: never, unused: string })[];
  infusions?: ItemTooltipInfusion[],
  unlocksColor?: { id: number, name: string, colors: { cloth: string, leather: string, metal: string } }
  rarity: { label: string, value: Gw2Api.Item['rarity'] },
  type?: string,
  weightClass?: string,
  level?: { label: string, value: number },
  description?: string,
  flags: string[],
  vendorValue?: number,
}
