import { Prisma } from '@gw2treasures/database';

export type ItemTableQuery = {
  where: string;
}

export function createItemTableQuery({ where }: { where: Prisma.ItemWhereInput }): ItemTableQuery {
  return { where: JSON.stringify(where) };
}

export function decodeItemTableQuery(query: ItemTableQuery): { where: Prisma.ItemWhereInput } {
  return { where: JSON.parse(query.where) };
}
