import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { isEmptyObject } from '../helper/is';
import { batch } from '../helper/batch';
import { toId } from '../helper/toId';
import { Gw2Api } from 'gw2-api-types';
import { PrismaPromise } from '@gw2treasures/database';

interface TpJobProps {
  ids: number[]
}

export const TpJob: Job = {
  async run(data: TpJobProps | Record<string, never>) {

    if(isEmptyObject(data)) {
      const itemIds = (await db.item.findMany({ select: { id: true }})).map(toId);
      const priceIds = (await fetchApi<number[]>('/v2/commerce/prices')).filter((id) => itemIds.includes(id));

      const batches = batch(priceIds, 200);

      for(const ids of batches) {
        await db.job.create({ data: { type: 'tp', data: { ids }}});
      }

      return `Queued ${batches.length} jobs for ${priceIds.length} entries`;
    }

    const prices = await fetchApi<Gw2Api.Commerce.Price[]>(`/v2/commerce/prices?ids=${data.ids.join(',')}`);

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
        }
      });

      updates.push(update);
    }

    await db.$transaction(updates);
  }
};
