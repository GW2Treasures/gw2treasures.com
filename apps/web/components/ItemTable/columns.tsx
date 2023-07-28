import { Prisma } from '@gw2treasures/database';
import { FunctionComponent, ReactNode } from 'react';
import { db } from '@/lib/prisma';
import { EntityIcon } from '../Entity/EntityIcon';
import { ItemLink } from '../Item/ItemLink';
import { Rarity } from '../Item/Rarity';
import { Coins } from '../Format/Coins';
import { QueryModel } from './query';

type Result<Select extends Prisma.ItemSelect> =
  Awaited<ReturnType<typeof db.item.findFirstOrThrow<{ select: Select }>>>;

export type OrderBy<T = Prisma.ItemOrderByWithRelationInput> = T | T[]

export interface ItemTableColumn<Select extends Prisma.ItemSelect> {
  id: GlobalColumnId,
  order?: number,
  select: Select,
  align?: 'right',
  orderBy?: [asc: OrderBy, desc: OrderBy]
}

export type ColumnModelTypes = {
  'item': { select: Prisma.ItemSelect, orderBy: Prisma.ItemOrderByWithRelationInput },
  'content': { select: Prisma.ContentSelect, orderBy: Prisma.ContentOrderByWithRelationInput },
}

export interface ExtraColumn<Id extends string, Model extends QueryModel, Select extends ColumnModelTypes[Model]['select']> {
  id: Id,
  select: Select,
  title: string;
  order?: number,
  component: FunctionComponent<{ item: Result<Select & { id: true }> }>
  align?: 'right',
  orderBy?: [asc: OrderBy<ColumnModelTypes[Model]['orderBy']>, desc: OrderBy<ColumnModelTypes[Model]['orderBy']>]
}

// typehelper
function createColumn<Select extends Prisma.ItemSelect>(column: ItemTableColumn<Select>) {
  return column;
}
export function extraColumn<Model extends QueryModel>(column: ExtraColumn<string, Model, ColumnModelTypes[Model]['select']>) {
  return column;
}

export type GlobalColumnId = 'id' | 'item' | 'icon' | 'name_de' | 'name_en' | 'name_es' | 'name_fr' | 'level' | 'rarity' | 'type' | 'vendorValue';

export const globalColumnDefinitions = {
  id: createColumn({
    id: 'id',
    order: 10,
    select: {},
    align: 'right',
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
    orderBy: [{ rarity: 'asc' }, { rarity: 'desc' }]
  }),
  type: createColumn({
    id: 'type',
    order: 100,
    select: { type: true, subtype: true },
    orderBy: [[{ type: 'asc' }, { subtype: 'asc' }], [{ type: 'desc' }, { subtype: 'desc' }]]
  }),
  vendorValue: createColumn({
    id: 'vendorValue',
    order: 110,
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
