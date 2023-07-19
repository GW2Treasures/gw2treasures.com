'use server';

import { db } from '@/lib/prisma';

import { ItemTableQuery, Signed, verify } from './query';
import { Prisma } from '@gw2treasures/database';

export interface ItemTableLoadOptions {
  skip?: number;
  take?: number;
  columns: Signed<Prisma.ItemSelect>[];
  orderBy?: Signed<OrderBy>;
}

export async function loadItems(query: Signed<ItemTableQuery>, options: ItemTableLoadOptions): Promise<{ id: number }[]> {
  const { where } = await verify(query);
  const orderBy = options.orderBy ? await verify(options.orderBy) : undefined;
  const { skip, take } = options;

  // TODO: this is a shallow merge, might need deep merging in the future
  const columns = await Promise.all(options.columns.map(verify));
  const select = columns.reduce((combined, current) => ({ ...combined, ...current }), {});

  // always include id to use as key
  select.id = true;

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

export async function loadTotalItemCount(query: Signed<ItemTableQuery>): Promise<number> {
  const { where } = await verify(query);

  return await db.item.count({ where });
}
