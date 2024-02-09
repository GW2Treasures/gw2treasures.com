import { db } from '@/lib/prisma';
import { publicApi } from '..';

export const GET = publicApi(async ({ searchParams: { rarity, type, subtype, weight }}) => {
  const items = await db.item.findMany({
    where: { rarity, type, subtype, weight },
    select: { id: true },
    orderBy: { id: 'asc' },
  });

  const ids = items.map(({ id }) => id);

  return { json: ids };
}, { maxAge: 1 });
