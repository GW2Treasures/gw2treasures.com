import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { toId } from '../helper/toId';
import { Gw2Api } from 'gw2-api-types';
import { Prisma, PrismaPromise } from '@gw2treasures/database';

export const TpJob: Job = {
  async run() {
    // get item ids that are available on the trading post
    const priceIds = await fetchApi<number[]>('/v2/commerce/prices');

    // get the 200 (max page_size for /v2/commerce/prices) items that were least recently updated and are included in the prices endpoint
    // TODO: handle when items are removed from the commerce APIs
    const itemIds = await db.item.findMany({
      where: { id: { in: priceIds }},
      orderBy: { tpCheckedAt: 'asc' },
      take: 200,
    });

    // load prices for the 200 items from the API
    const prices = await fetchApi<Gw2Api.Commerce.Price[]>(`/v2/commerce/prices?ids=${itemIds.map(toId).join(',')}`);

    const tpCheckedAt = new Date();
    const updates: PrismaPromise<unknown>[] = [];
    const history: Prisma.TradingPostHistoryCreateInput[] = [];

    // construct queries for each item
    for(const price of prices) {
      const data = {
        buyQuantity: price.buys?.quantity,
        buyPrice: price.buys?.unit_price,
        sellQuantity: price.sells?.quantity,
        sellPrice: price.sells?.unit_price,
      };

      // update the current state on the item
      const update = db.item.updateMany({
        where: { id: price.id },
        data: {
          tpTradeable: true,
          tpWhitelisted: price.whitelisted,
          ...data,
          tpCheckedAt,
        }
      });

      updates.push(update);

      // create a new history entry
      history.push({ itemId: price.id, ...data });
    }

    // create a single insert for all history entries
    updates.push(db.tradingPostHistory.createMany({
      data: history
    }));

    // run all queries in a single transaction for better performance
    await db.$transaction(updates);

    return `Updated TP prices for ${itemIds.length} items`;
  }
};
