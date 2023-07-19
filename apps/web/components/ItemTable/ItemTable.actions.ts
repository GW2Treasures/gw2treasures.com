'use server';

import { db } from '@/lib/prisma';

import { ItemTableQuery, decodeItemTableQuery } from './query';
import { Item, Prisma } from '@gw2treasures/database';

export interface ItemTableLoadOptions {
  skip?: number;
  take?: number;
  columnSelects: Prisma.ItemSelect[];
}

export async function loadItems(query: ItemTableQuery, options: ItemTableLoadOptions): Promise<{ id: number }[]> {
  const { where } = decodeItemTableQuery(query);
  const { skip, take } = options;

  // TODO: this is a shallow merge, might need deep merging in the future
  const select = options.columnSelects.reduce((combined, current) => ({ ...combined, ...current }));

  // always include id to use as key
  select.id = true;

  const items = await db.item.findMany({
    where,
    skip,
    take,
    select
  });

  // TODO: this could be generified as well, but probably not needed. The id is the only property the table needs.
  return items as { id: number }[];
}

export async function loadTotalItemCount(query: ItemTableQuery): Promise<number> {
  const { where } = decodeItemTableQuery(query);

  return await db.item.count({ where });
}
