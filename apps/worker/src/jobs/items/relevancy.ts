import { db } from '../../db';
import { Job } from '../job';

export const ItemsRelevancy: Job = {
  run: async () => {
    // get the max volume and max views over all items
    const [{ maxBuyQuantity, maxSellQuantity, maxViews }] = await db.$queryRaw<[{ maxBuyQuantity: number, maxSellQuantity: number, maxViews: number }]>`
      SELECT
        MAX("buyQuantity") as "maxBuyQuantity",
        MAX("sellQuantity") as "maxSellQuantity",
        MAX("views") as "maxViews"
      FROM "Item";`;

    console.log('  max buy quantity:', maxBuyQuantity);
    console.log('  max sell quantity:', maxSellQuantity);
    console.log('  max views:', maxViews);

    // update relevancy to the average of the normalized volume and views
    // we need to cast to float, otherwise the result will be rounded to integer
    // views is weighted the same as both quantities
    const updated = await db.$executeRaw`
      UPDATE "Item" SET "relevancy" = (
        (COALESCE("buyQuantity", 0) / ${maxBuyQuantity}::float) +
        (COALESCE("sellQuantity", 0) / ${maxSellQuantity}::float) +
        ("views" * 2.0 / ${maxViews})
      ) / 4`;

    return `Updated relevancy scores of ${updated} items`;
  }
};
