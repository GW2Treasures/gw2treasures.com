import { db } from '@/lib/prisma';
import { publicApi } from '..';
import { cache } from '@/lib/cache';

const maxAge = 60;

const getData = cache(async () => {
  const achievements = await db.achievement.findMany({
    select: { id: true },
    orderBy: { id: 'asc' },
  });

  const ids = achievements.map(({ id }) => id);

  return { json: ids };
}, ['api/achievements'], { revalidate: maxAge });

export const GET = publicApi(
  '/achievements',
  getData,
  { maxAge }
);
