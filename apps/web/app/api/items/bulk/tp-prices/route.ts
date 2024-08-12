import { db } from '@/lib/prisma';
import { publicApi, type PublicApiResponse } from '../../..';
import { cache } from '@/lib/cache';
import { isDefined } from '@gw2treasures/helper/is';

const maxItemId = Math.pow(2, 31) - 1;
const maxAge = 60 * 60;

const getData = cache(async (ids: number[]): Promise<PublicApiResponse> => {
  const items = await db.item.findMany({
    where: { id: { in: ids }},
    select: {
      id: true,
      tpTradeable: true,
      tpWhitelisted: true,
      buyPrice: true,
      buyQuantity: true,
      sellPrice: true,
      sellQuantity: true,
      tpCheckedAt: true,
    }
  });

  const tradeableItems = items.filter(({ tpTradeable }) => tpTradeable);

  return {
    json: tradeableItems.map(({ id, tpWhitelisted: whitelisted, buyPrice, buyQuantity, sellPrice, sellQuantity, tpCheckedAt }) => ({
      id,
      whitelisted,
      buys: { quantity: buyQuantity, unit_price: buyPrice },
      sells: { quantity: sellQuantity, unit_price: sellPrice },
      ['_gw2treasures']: { updatedAt: tpCheckedAt }
    })),
    status: tradeableItems.length === 0 ? 404 : tradeableItems.length < ids.length ? 206 : 200
  };
}, ['api/items/bulk/tp-prices'], { revalidate: maxAge });

export const GET = publicApi(
  '/items/bulk/tp-prices',
  ({ searchParams: { ids }}) => {
    if(!ids) {
      return { error: 400, text: 'Missing `ids` query parameter' };
    }

    const itemIds = ids.split(',').map((id) => {
      const numericId = Number(id);
      return (isNaN(numericId) || numericId <= 0 || numericId > maxItemId || numericId.toString() !== id) ? undefined : numericId;
    }).filter(isDefined);

    return getData(itemIds);
  },
  { maxAge }
);
