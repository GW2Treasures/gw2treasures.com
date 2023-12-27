import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { toId } from '../helper/toId';
import { Gw2Api } from 'gw2-api-types';
import { PrismaPromise } from '@gw2treasures/database';

export const TpJob: Job = {
  async run() {
    const priceIds = await fetchApi<number[]>('/v2/commerce/prices');
    const itemIds = await db.item.findMany({
      where: { id: { in: priceIds }},
      orderBy: { tpCheckedAt: 'desc' },
      take: 200,
    });

    const tpCheckedAt = new Date();
    const prices = await fetchApi<Gw2Api.Commerce.Price[]>(`/v2/commerce/prices?ids=${itemIds.map(toId).join(',')}`);

    const updates: PrismaPromise<unknown>[] = [];

    for(const price of prices) {
      const update = db.item.updateMany({
        where: { id: price.id },
        data: {
          tpTradeable: true,
          tpWhitelisted: price.whitelisted,
          buyQuantity: price.buys?.quantity,
          buyPrice: price.buys?.unit_price,
          sellQuantity: price.sells?.quantity,
          sellPrice: price.sells?.unit_price,
          tpCheckedAt,
        }
      });

      updates.push(update);
    }

    await db.$transaction(updates);

    return `Updated TP prices for ${itemIds.length} items`;
  }
};
