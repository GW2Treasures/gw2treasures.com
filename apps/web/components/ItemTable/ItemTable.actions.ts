'use server';

import { db } from '@/lib/prisma';

import { ItemTableQuery, QueryModel, Signed, verify } from './query';
import { OrderBy } from './columns';
import deepmerge from 'deepmerge';
import { TODO } from '@/lib/todo';

export interface ItemTableLoadOptions {
  skip?: number;
  take?: number;
  columns: Signed<any>[];
  orderBy?: Signed<OrderBy>;
}

export async function loadItems<Model extends QueryModel>(query: Signed<ItemTableQuery<Model>>, options: ItemTableLoadOptions): Promise<{ id: number }[]> {
  const { where } = await verify(query);
  const orderBy = options.orderBy ? await verify(options.orderBy) : undefined;
  const { skip, take } = options;

  const idSelect = query.data.mapToItem ? { [query.data.mapToItem]: { select: { id: true }}} : { id: true };

  const columns = await Promise.all(options.columns.map(verify));
  const select = deepmerge.all([idSelect, ...columns]);

  if(query.data.model === 'content') {
    return db.content.findMany({ where, skip, take, select, orderBy: mapOrderBy(orderBy, query.data.mapToItem!) }) as TODO;
  }

  const items = await db.item.findMany({
    where,
    skip,
    take,
    select,
    orderBy
  });

  // TODO: this could be generified as well, but probably not needed. The id is the only property the table needs.
  return items as { id: number }[];
}

export async function loadTotalItemCount<Model extends QueryModel>(query: Signed<ItemTableQuery<Model>>): Promise<number> {
  const { where, model = 'item' } = await verify(query);

  switch(model) {
    case 'item': return db.item.count({ where });
    case 'content': return db.content.count({ where });
    default: throw new Error('Unsupported query model');
  }
}

function mapOrderBy(orderBy: OrderBy | undefined, item: string) {
  if(orderBy === undefined) {
    return undefined;
  }

  if(Array.isArray(orderBy)) {
    return orderBy.map((order) => ({ [item]: order }));
  }

  return { [item]: orderBy };
}
