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
    render: (item) => item.name_de
  }),
  name_en: createColumn({
    id: 'name_en',
    select: { name_en: true },
    render: (item) => item.name_en
  }),
  name_es: createColumn({
    id: 'name_es',
    select: { name_es: true },
    render: (item) => item.name_es
  }),
  name_fr: createColumn({
    id: 'name_fr',
    select: { name_fr: true },
    render: (item) => item.name_fr
  }),
  level: createColumn({
    id: 'level',
    select: { level: true },
    render: (item) => item.level,
    align: 'right',
  }),
  rarity: createColumn({
    id: 'rarity',
    select: { rarity: true },
    render: (item) => <Rarity rarity={item.rarity}/>
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
  }),
};

