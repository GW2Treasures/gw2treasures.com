import { db } from '@/lib/prisma';
import { publicApi } from '..';
import { cache } from '@/lib/cache';

const maxAge = 60;

const getData = cache(async ({ rarity, type, subtype, weight, tpTradeable, mysticForge, containerContents }) => {
  const items = await db.item.findMany({
    where: {
      rarity, type, subtype, weight, tpTradeable,
      mysticForgeRecipeOutput: mysticForge ? { some: {}} : undefined,
      OR: containerContents ? [{ contains: { some: {}}}, { containsCurrency: { some: {}}}] : undefined
    },
    select: { id: true },
    orderBy: { id: 'asc' },
  });

  const ids = items.map(({ id }) => id);

  return { json: ids };
}, ['api/items'], { revalidate: maxAge });

export const GET = publicApi(
  '/items',
  ({ searchParams: { rarity, type, subtype, weight, 'tp-tradeable': tpTradeable, 'mystic-forge': mysticForge, 'container-contents': containerContents }}) =>
    getData({ rarity, type, subtype, weight, tpTradeable, mysticForge, containerContents }),
  { maxAge }
);
