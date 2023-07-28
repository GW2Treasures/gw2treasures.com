import { Prisma } from '@gw2treasures/database';
import { FunctionComponent } from 'react';
import { db } from '@/lib/prisma';
import { Signed } from './query';

export type GlobalColumnId = 'id' | 'item' | 'icon' | 'name_de' | 'name_en' | 'name_es' | 'name_fr' | 'level' | 'rarity' | 'type' | 'vendorValue';

export interface ItemTableQuery<Model extends QueryModel = 'item'> {
  model?: Model;
  where: ModelWhereMap[Model]['where'];
  mapToItem?: ModelWhereMap[Model]['map']
}

export type QueryModel = keyof ModelWhereMap;

export type ModelWhereMap = {
  'item': { where: Prisma.ItemWhereInput, map: undefined };
  'content': { where: Prisma.ContentWhereInput, map: 'containerItem' | 'contentItem' };
}

export type Result<Select extends Prisma.ItemSelect> =
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

export type AvailableColumn<ColumnId extends string> = {
  id: ColumnId,
  title: string,
  select: Signed<Prisma.ItemSelect>,
  orderBy?: [asc: Signed<OrderBy>, desc: Signed<OrderBy>],
  align?: 'right',
  component?: FunctionComponent<{ item: any }>
}

export type AvailableColumns<ColumnId extends string> = Record<ColumnId, AvailableColumn<ColumnId>>

