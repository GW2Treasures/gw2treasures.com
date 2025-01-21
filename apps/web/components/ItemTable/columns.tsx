import { Prisma, Rarity as RarityEnum } from '@gw2treasures/database';
import type { ReactNode } from 'react';
import { EntityIcon } from '../Entity/EntityIcon';
import { ItemLink } from '../Item/ItemLink';
import { Rarity } from '../Item/Rarity';
import { Coins } from '../Format/Coins';
import type { ColumnModelTypes, ExtraColumn, GlobalColumnId, ItemTableColumn, QueryModel, Result } from './types';
import { FormatNumber } from '../Format/FormatNumber';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Icon } from '@gw2treasures/ui';
import { FormatDate } from '../Format/FormatDate';
import type { TranslationId } from '@/lib/translate';
import { translations, type TypeTranslation } from '../Item/ItemType.translations';
import { ItemType } from '../Item/ItemType';
import type { SubType, Type } from '../Item/ItemType.types';
import { PriceTrend } from '../Item/PriceTrend';

// typehelper
function createColumn<Select extends Prisma.ItemSelect, Translations extends TranslationId = never>(column: ItemTableColumn<Select, Translations>) {
  return column;
}
export function extraColumn<Model extends QueryModel>(column: ExtraColumn<string, Model, ColumnModelTypes[Model]['select']>) {
  return column;
}

export const globalColumnDefinitions = {
  id: createColumn({
    id: 'id',
    order: 10,
    select: {},
    align: 'right',
    small: true,
    orderBy: [{ id: 'asc' }, { id: 'desc' }]
  }),
  item: createColumn({
    id: 'item',
    order: 20,
    select: { rarity: true, name_de: true, name_en: true, name_es: true, name_fr: true, icon: true },
  }),
  icon: createColumn({
    id: 'icon',
    order: 30,
    select: { icon: true },
  }),
  name_de: createColumn({
    id: 'name_de',
    order: 40,
    select: { name_de: true },
    orderBy: [{ name_de: 'asc' }, { name_de: 'desc' }]
  }),
  name_en: createColumn({
    id: 'name_en',
    order: 50,
    select: { name_en: true },
    orderBy: [{ name_en: 'asc' }, { name_en: 'desc' }]
  }),
  name_es: createColumn({
    id: 'name_es',
    order: 60,
    select: { name_es: true },
    orderBy: [{ name_es: 'asc' }, { name_es: 'desc' }]
  }),
  name_fr: createColumn({
    id: 'name_fr',
    order: 70,
    select: { name_fr: true },
    orderBy: [{ name_fr: 'asc' }, { name_fr: 'desc' }]
  }),
  level: createColumn({
    id: 'level',
    order: 80,
    select: { level: true },
    align: 'right',
    orderBy: [{ level: 'asc' }, { level: 'desc' }]
  }),
  rarity: createColumn({
    id: 'rarity',
    order: 90,
    select: { rarity: true },
    orderBy: [{ rarity: 'asc' }, { rarity: 'desc' }],
    translations: Object.values(RarityEnum).map((rarity) => `rarity.${rarity}` as const)
  }),
  type: createColumn({
    id: 'type',
    order: 100,
    select: { type: true, subtype: true },
    orderBy: [[{ type: 'asc' }, { subtype: 'asc' }], [{ type: 'desc' }, { subtype: 'desc' }]],
    translations: translations.long
  }),
  vendorValue: createColumn({
    id: 'vendorValue',
    order: 110,
    select: { vendorValue: true },
    align: 'right',
    orderBy: [{ vendorValue: { sort: 'asc', nulls: 'last' }}, { vendorValue: { sort: 'desc', nulls: 'last' }}],
    translations: ['item.flag.NoSell']
  }),
  buyPrice: createColumn({
    id: 'buyPrice',
    order: 120,
    select: { buyPrice: true, tpCheckedAt: true, tpTradeable: true },
    align: 'right',
    orderBy: [{ buyPrice: 'asc' }, { buyPrice: 'desc' }]
  }),
  buyPriceTrend: createColumn({
    id: 'buyPriceTrend',
    order: 125,
    select: { tpHistory: { orderBy: { time: 'asc' }}, tpTradeable: true },
    align: 'right',
  }),
  buyQuantity: createColumn({
    id: 'buyQuantity',
    order: 130,
    select: { buyQuantity: true, tpTradeable: true },
    align: 'right',
    orderBy: [{ buyQuantity: 'asc' }, { buyQuantity: 'desc' }]
  }),
  sellPrice: createColumn({
    id: 'sellPrice',
    order: 140,
    select: { sellPrice: true, tpCheckedAt: true, tpTradeable: true },
    align: 'right',
    orderBy: [{ sellPrice: { sort: 'asc', nulls: 'first' }}, { sellPrice: { sort: 'desc', nulls: 'last' }}]
  }),
  sellPriceTrend: createColumn({
    id: 'sellPriceTrend',
    order: 145,
    select: { tpHistory: { orderBy: { time: 'asc' }}, tpTradeable: true },
    align: 'right',
  }),
  sellQuantity: createColumn({
    id: 'sellQuantity',
    order: 150,
    select: { sellQuantity: true, tpTradeable: true },
    align: 'right',
    orderBy: [{ sellQuantity: 'asc' }, { sellQuantity: 'desc' }]
  }),
  createdAt: createColumn({
    id: 'createdAt',
    order: 160,
    select: { createdAt: true },
    orderBy: [{ createdAt: 'asc' }, { createdAt: 'desc' }]
  }),
};

type ColumnDefinition<Id extends GlobalColumnId> = (typeof globalColumnDefinitions)[Id];
type AvailableTranslations<Id extends GlobalColumnId> = ColumnDefinition<Id> extends ItemTableColumn<Prisma.ItemSelect, infer Translations> ? Translations : never;

type Renderer = {
  [Id in GlobalColumnId]: (item: Result<ColumnDefinition<Id>['select'] & { id: true }>, translations: Record<AvailableTranslations<Id>, string>) => ReactNode;
};

const empty = (label = '-') => <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>;

export const globalColumnRenderer: Renderer = {
  id: (item) => item.id,
  item: (item) => <ItemLink item={item}/>,
  icon: (item) => item.icon && <EntityIcon size={32} icon={item.icon}/>,
  name_de: (item) => item.name_de,
  name_en: (item) => item.name_en,
  name_es: (item) => item.name_es,
  name_fr: (item) => item.name_fr,
  level: (item) => item.level,
  rarity: (item, t) => <Rarity rarity={item.rarity}>{t[`rarity.${item.rarity}`]}</Rarity>,
  type: (item, t) => <ItemType type={item.type as Type} subtype={item.subtype as SubType<Type>} translations={t as Record<TypeTranslation<Type, SubType<Type>>, string>} display="long"/>,
  vendorValue: (item, t) => item.vendorValue === null ? empty(t['item.flag.NoSell']) : <Coins value={item.vendorValue}/>,
  buyPrice: (item) => !item.tpTradeable ? empty() : renderPriceWithOptionalWarning(item.tpCheckedAt, item.buyPrice),
  buyPriceTrend: (item) => !item.tpTradeable ? empty() : <PriceTrend history={item.tpHistory} price="buyPrice"/>,
  buyQuantity: (item) => !item.tpTradeable ? empty() : <FormatNumber value={item.buyQuantity ?? 0}/>,
  sellPrice: (item) => !item.tpTradeable ? empty() : renderPriceWithOptionalWarning(item.tpCheckedAt, item.sellPrice),
  sellPriceTrend: (item) => !item.tpTradeable ? empty() : <PriceTrend history={item.tpHistory} price="sellPrice"/>,
  sellQuantity: (item) => !item.tpTradeable ? empty() : <FormatNumber value={item.sellQuantity ?? 0}/>,
  createdAt: (item) => <FormatDate date={new Date(item.createdAt)}/>,
};

export function renderPriceWithOptionalWarning(date: Date | string | null, price: number | null): ReactNode {
  if(!price) {
    return empty();
  }

  const lastCheckedAt = date ? new Date(date) : undefined;
  const now = new Date();

  // if we don't have a timestamp or the timestamp is more than 12 hours ago show a warning
  if(!lastCheckedAt || (now.valueOf() - lastCheckedAt.valueOf()) > 1000 * 60 * 60 * 12) {
    return (
      <FlexRow inline>
        <Tip tip={<>Last Updated: <FormatDate relative date={lastCheckedAt}/></>}><Icon icon="warning" color="var(--color-text-muted)"/></Tip>
        <Coins value={price}/>
      </FlexRow>
    );
  }

  return <Coins value={price}/>;
}
