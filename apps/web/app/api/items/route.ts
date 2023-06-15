import { db } from '@/lib/prisma';
import { publicApi } from '..';

export const GET = publicApi(async () => {
  const items = await db.item.findMany({
    select: { id: true },
    orderBy: { id: 'asc' },
  });

  const ids = items.map(({ id }) => id);

  return ids;
});
