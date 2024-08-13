import { db } from '@/lib/prisma';
import { publicApi, type PublicApiResponse } from '../../..';
import { cache } from '@/lib/cache';
import { isDefined } from '@gw2treasures/helper/is';

const maxItemId = Math.pow(2, 31) - 1;
const maxAge = 60 * 60;

const getData = cache(async (ids: number[]): Promise<PublicApiResponse> => {
  const items = await db.item.findMany({
    where: { id: { in: ids }, tpTradeable: true },
    select: {
      id: true,
      tpWhitelisted: true,
      buyPrice: true,
      buyQuantity: true,
      sellPrice: true,
      sellQuantity: true,
      tpCheckedAt: true,
    }
  });

  return {
    json: items.map(({ id, tpWhitelisted: whitelisted, buyPrice, buyQuantity, sellPrice, sellQuantity, tpCheckedAt }) => ({
      id,
      whitelisted,
      buys: { quantity: buyQuantity, unit_price: buyPrice },
      sells: { quantity: sellQuantity, unit_price: sellPrice },
      ['_gw2treasures']: { updatedAt: tpCheckedAt }
    })),
    status: items.length === 0 ? 404 : items.length < ids.length ? 206 : 200
  };
}, ['api/items/bulk/tp-prices'], { revalidate: maxAge });

export const GET = publicApi(
  '/items/bulk/tp-prices',
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
