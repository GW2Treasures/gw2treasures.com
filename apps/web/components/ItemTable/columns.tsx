import { Item, Prisma } from '@gw2treasures/database';
import { FunctionComponent, ReactNode } from 'react';
import { db } from '@/lib/prisma';
import { EntityIcon } from '../Entity/EntityIcon';
import { ItemLink } from '../Item/ItemLink';
import { Rarity } from '../Item/Rarity';
import { Coins } from '../Format/Coins';

type Result<Select extends Prisma.ItemSelect> =
  Awaited<ReturnType<typeof db.item.findFirstOrThrow<{ select: Select }>>>;

export type OrderBy = Prisma.ItemOrderByWithRelationInput | Prisma.ItemOrderByWithRelationInput[]

export interface ItemTableColumn<Select extends Prisma.ItemSelect> {
  id: GlobalColumnId,
  select: Select,
  align?: 'right',
  orderBy?: [asc: OrderBy, desc: OrderBy]
}

export interface ExtraColumn<Id extends string, Select extends Prisma.ItemSelect> {
  id: Id,
  select: Select,
  title: string;
  component: FunctionComponent<{ item: Result<Select & { id: true }> }>
  align?: 'right',
  orderBy?: [asc: OrderBy, desc: OrderBy]
}

// typehelper
function createColumn<Select extends Prisma.ItemSelect>(column: ItemTableColumn<Select>) {
  return column;
}
export function extraColumn<ID extends string, Select extends Prisma.ItemSelect>(column: ExtraColumn<ID, Select>) {
  return column;
}

export type GlobalColumnId = 'id' | 'item' | 'icon' | 'name_de' | 'name_en' | 'name_es' | 'name_fr' | 'level' | 'rarity' | 'type' | 'vendorValue';

export const globalColumnDefinitions = {
  id: createColumn({
    id: 'id',
    select: {},
    align: 'right',
    orderBy: [{ id: 'asc' }, { id: 'desc' }]
  }),
  item: createColumn({
    id: 'item',
    select: { rarity: true, name_de: true, name_en: true, name_es: true, name_fr: true, icon: true },
  }),
  icon: createColumn({
    id: 'icon',
    select: { icon: true },
  }),
  name_de: createColumn({
    id: 'name_de',
    select: { name_de: true },
    orderBy: [{ name_de: 'asc' }, { name_de: 'desc' }]
  }),
  name_en: createColumn({
    id: 'name_en',
    select: { name_en: true },
    orderBy: [{ name_en: 'asc' }, { name_en: 'desc' }]
  }),
  name_es: createColumn({
    id: 'name_es',
    select: { name_es: true },
    orderBy: [{ name_es: 'asc' }, { name_es: 'desc' }]
  }),
  name_fr: createColumn({
    id: 'name_fr',
    select: { name_fr: true },
    orderBy: [{ name_fr: 'asc' }, { name_fr: 'desc' }]
  }),
  level: createColumn({
    id: 'level',
    select: { level: true },
    align: 'right',
    orderBy: [{ level: 'asc' }, { level: 'desc' }]
  }),
  rarity: createColumn({
    id: 'rarity',
    select: { rarity: true },
    orderBy: [{ rarity: 'asc' }, { rarity: 'desc' }]
  }),
  type: createColumn({
    id: 'type',
    select: { type: true, subtype: true },
    orderBy: [[{ type: 'asc' }, { subtype: 'asc' }], [{ type: 'desc' }, { subtype: 'desc' }]]
  }),
  vendorValue: createColumn({
    id: 'vendorValue',
    select: { value: true },
    align: 'right',
    orderBy: [{ value: 'asc' }, { value: 'desc' }]
  }),
};

type Renderer = {
  [id in GlobalColumnId]: (item: Result<(typeof globalColumnDefinitions)[id]['select'] & { id: true }>) => ReactNode;
};

export const globalColumnRenderer: Renderer = {
  id: (item) => item.id,
  item: (item) => <ItemLink item={item}/>,
  icon: (item) => item.icon && <EntityIcon size={32} icon={item.icon}/>,
  name_de: (item) => item.name_de,
  name_en: (item) => item.name_en,
  name_es: (item) => item.name_es,
  name_fr: (item) => item.name_fr,
  level: (item) => item.level,
  rarity: (item) => <Rarity rarity={item.rarity}/>,
  type: (item) => <>{item.type} {item.subtype && `(${item.subtype})`}</>,
  vendorValue: (item) => <Coins value={item.value}/>,
};
