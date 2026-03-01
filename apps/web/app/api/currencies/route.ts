import { db } from '@/lib/prisma';
import { publicApi } from '..';
import { cache } from '@/lib/cache';

const maxAge = 60;

const getData = cache(async () => {
  const currencies = await db.currency.findMany({
    select: { id: true },
    orderBy: { id: 'asc' },
  });

  const ids = currencies.map(({ id }) => id);

  return { json: ids };
}, ['api/currencies'], { revalidate: maxAge });

export const GET = publicApi(
  '/currencies',
  getData,
  { maxAge }
);
