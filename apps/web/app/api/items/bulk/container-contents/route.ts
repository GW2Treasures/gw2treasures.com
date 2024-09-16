import { db } from '@/lib/prisma';
import { publicApi, type PublicApiResponse } from '../../..';
import { cache } from '@/lib/cache';
import { isDefined } from '@gw2treasures/helper/is';

const maxItemId = Math.pow(2, 31) - 1;
const maxAge = 60 * 60;

const getData = cache(async (ids: number[]): Promise<PublicApiResponse> => {
  const items = await db.item.findMany({
    where: { id: { in: ids }, OR: [{ contains: { some: {}}}, { containsCurrency: { some: {}}}] },
    select: {
      id: true,
      contains: { select: { contentItemId: true, quantity: true, chance: true }},
      containsCurrency: { select: { currencyId: true, min: true, max: true }}
    }
  });

  return {
    json: items.map(({ id, contains, containsCurrency }) => ({
      id,
      contents: [
        ...contains.map(({ contentItemId: id, quantity, chance }) => ({ type: 'Item', id, quantity, chance })),
        ...containsCurrency.map(({ currencyId: id, min, max }) => ({ type: 'Currency', id, min, max }))
      ]
    })),
    status: items.length === 0 ? 404 : items.length < ids.length ? 206 : 200
  };
}, ['api/items/bulk/container-contents'], { revalidate: maxAge });

export const GET = publicApi(
  '/items/bulk/container-contents',
  ({ searchParams: { ids }}) => {
    if(!ids) {
      return { error: 400, text: 'Missing `ids` query parameter' };
    }

    const rawIds = ids.split(',');

    if(rawIds.length > 1000) {
      return { error: 400, text: 'Only 1000 ids allowed' };
    }

    const itemIds = rawIds.map((id) => {
      const numericId = Number(id);
      return (isNaN(numericId) || numericId <= 0 || numericId > maxItemId || numericId.toString() !== id) ? undefined : numericId;
    }).filter(isDefined);

    return getData(itemIds);
  },
  { maxAge }
);
