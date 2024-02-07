import { Prisma } from '@gw2treasures/database';
import { db } from '../../db';
import { Job } from '../job';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { batch } from '../helper/batch';
import { toId } from '../helper/toId';

interface HistoryEntry {
  buy_price_max: number,
  buy_quantity_max: number,
  date: string,
  itemID: number,
  sell_price_max: number,
  sell_quantity_max: number
  }

export const TpImportJob: Job = {
  async run(itemIds: number[] | Record<string, never>) {
    if(isEmptyObject(itemIds)) {
      const allItemIds = await db.item.findMany({ select: { id: true }});

      await db.job.deleteMany({ where: { type: 'tp.import', priority: 0 }});

      const jobs = await db.job.createMany({
        data: batch(allItemIds.map(toId), 50).map((ids) => ({ type: 'tp.import', data: ids, priority: 0 }))
      });

      return `Created ${jobs.count} import jobs`;
    }

    const data = await fetch(`https://api.datawars2.ie/gw2/v2/history/json?fields=sell_price_max,sell_quantity_max,buy_price_max,buy_quantity_max,date,itemID&itemID=${itemIds.join(',')}`).then((r) => r.json()) as HistoryEntry[];

    if(data.length === 0) {
      return 'Nothing imported';
    }

    const create = await db.tradingPostHistory.createMany({
      data: data.map<Prisma.TradingPostHistoryCreateInput>((entry) => ({
        itemId: entry.itemID,
        buyPrice: entry.buy_price_max,
        buyQuantity: entry.buy_quantity_max,
        sellPrice: entry.sell_price_max,
        sellQuantity: entry.sell_quantity_max,
        time: new Date(entry.date),
      })),
      skipDuplicates: true,
    });

    return `Imported ${create.count}/${data.length} historic prices for ${itemIds.length} items`;
  }
};
