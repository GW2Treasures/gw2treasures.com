'use server';

import { db } from '@/lib/prisma';

import { type Signed, verify } from './query';
import deepmerge from 'deepmerge';
import type { TODO } from '@/lib/todo';
import type { ColumnModelTypes, GlobalColumnId, ItemTableQuery, LoadItemsResult, OrderBy, QueryModel } from './types';
import { globalColumnDefinitions } from './columns';
import { isString } from '@gw2treasures/helper/is';
import { getTranslate } from '@/lib/translate';

export interface ItemTableLoadOptions<Model extends QueryModel> {
  skip?: number;
  take?: number;
  columns: Signed<GlobalColumnId | object>[];
  orderBy?: Signed<OrderBy<ColumnModelTypes[Model]['orderBy']>>;
}

const defaultItemSort = [{ views: 'desc' }, { id: 'asc' }];

export async function loadItems<Model extends QueryModel>(query: Signed<ItemTableQuery<Model>>, options: ItemTableLoadOptions<Model>): LoadItemsResult {
  const { where, mapToItem, model = 'item' } = await verify(query);
  const orderBy = options.orderBy ? await verify(options.orderBy) : undefined;
  const { skip, take } = options;

  const mapToItemSelect = (select: object) => mapToItem ? { [mapToItem]: { select }} : select;

  const idSelect = model === 'mysticForgeRecipe' ? { id: true } : mapToItemSelect({ id: true });

  const columns = await Promise.all(options.columns.map(verify));
  const selects = [
    idSelect,
    ...columns.map((column) => isString(column) ? mapToItemSelect(globalColumnDefinitions[column].select) : column)
  ];
  const select = deepmerge.all(selects);

  const defaultSort = defaultItemSort.map((order) => mapToItem ? { [mapToItem]: order } : order);

  const findManyArgs = { where, skip, take, select: select as TODO, orderBy: orderBy as TODO ?? defaultSort };

  const items: TODO =
    model === 'content' ? await db.content.findMany(findManyArgs) :
    model === 'mysticForgeRecipe' ? await db.mysticForgeRecipe.findMany(findManyArgs as TODO) :
    model === 'item' ? await db.item.findMany(findManyArgs as TODO) :
    undefined;

  const translationIds = Array.from(new Set(columns.flatMap((column) => isString(column)
    ? (globalColumnDefinitions[column].translations ?? [])
    : []
  )));

  const translate = getTranslate();
  const translations = Object.fromEntries(
    translationIds.map((translationId) => [translationId, translate(translationId)])
  );

  return { items, translations };
}

export async function loadTotalItemCount<Model extends QueryModel>(query: Signed<ItemTableQuery<Model>>): Promise<number> {
  const { where, model = 'item' } = await verify(query);

  switch(model) {
    case 'item': return db.item.count({ where } as TODO);
    case 'mysticForgeRecipe': return db.mysticForgeRecipe.count({ where } as TODO);
    case 'content': return db.content.count({ where });
    default: throw new Error('Unsupported query model');
  }
}
