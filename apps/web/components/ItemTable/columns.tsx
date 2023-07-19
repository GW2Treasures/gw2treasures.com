import { Item, Prisma } from '@gw2treasures/database';
import { ReactNode } from 'react';
import { db } from '@/lib/prisma';
import { EntityIcon } from '../Entity/EntityIcon';
import { ItemLink } from '../Item/ItemLink';
import { Rarity } from '../Item/Rarity';
import { Coins } from '../Format/Coins';

type Result<Select extends Prisma.ItemSelect> =
  Awaited<ReturnType<typeof db.item.findFirstOrThrow<{ select: Select }>>>;

export interface ItemTableColumn<Select extends Prisma.ItemSelect> {
  id: DefaultColumnName,
  select: Select,
  render: (item: Result<Select>) => ReactNode,
  align?: 'right',
  orderBy?: [ascending: Prisma.ItemOrderByWithRelationInput, descending: Prisma.ItemOrderByWithRelationInput]
}

// typehelper
function createColumn<Select extends Prisma.ItemSelect>(column: ItemTableColumn<Select>) {
  return column;
}

export type DefaultColumnName = 'id' | 'item' | 'icon' | 'name_de' | 'name_en' | 'name_es' | 'name_fr' | 'level' | 'rarity' | 'type' | 'vendorValue';

export const defaultColumnDefinitions = {
  id: createColumn({
    id: 'id',
    select: { id: true },
    render: ({ id }) => id,
    align: 'right',
    orderBy: [{ id: 'asc' }, { id: 'desc' }]
  }),
  item: createColumn({
    id: 'item',
    select: { id: true, rarity: true, name_de: true, name_en: true, name_es: true, name_fr: true, icon: true },
    render: (item) => <ItemLink item={item}/>
  }),
  icon: createColumn({
    id: 'icon',
    select: { icon: true },
    render: (item) => item.icon && <EntityIcon size={32} icon={item.icon}/>
  }),
  name_de: createColumn({
    id: 'name_de',
    select: { name_de: true },
    render: (item) => item.name_de,
    orderBy: [{ name_de: 'asc' }, { name_de: 'desc' }]
  }),
  name_en: createColumn({
    id: 'name_en',
    select: { name_en: true },
    render: (item) => item.name_en,
    orderBy: [{ name_en: 'asc' }, { name_en: 'desc' }]
  }),
  name_es: createColumn({
    id: 'name_es',
    select: { name_es: true },
    render: (item) => item.name_es,
    orderBy: [{ name_es: 'asc' }, { name_es: 'desc' }]
  }),
  name_fr: createColumn({
    id: 'name_fr',
    select: { name_fr: true },
    render: (item) => item.name_fr,
    orderBy: [{ name_fr: 'asc' }, { name_fr: 'desc' }]
  }),
  level: createColumn({
    id: 'level',
    select: { level: true },
    render: (item) => item.level,
    align: 'right',
    orderBy: [{ level: 'asc' }, { level: 'desc' }]
  }),
  rarity: createColumn({
    id: 'rarity',
    select: { rarity: true },
    render: (item) => <Rarity rarity={item.rarity}/>,
    orderBy: [{ rarity: 'asc' }, { rarity: 'desc' }]
  }),
  type: createColumn({
    id: 'type',
    select: { type: true, subtype: true },
    render: (item) => <>{item.type} {item.subtype && `(${item.subtype})`}</>
  }),
  vendorValue: createColumn({
    id: 'vendorValue',
    select: { value: true },
    render: (item) => <Coins value={item.value}/>,
    align: 'right',
    orderBy: [{ value: 'asc' }, { value: 'desc' }]
  }),
};

