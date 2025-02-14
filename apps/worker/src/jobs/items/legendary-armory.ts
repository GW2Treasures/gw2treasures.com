import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { toId } from '../helper/toId';
import { Job } from '../job';

export const ItemsLegendaryArmoryJob: Job = {
  async run() {
    const legendaryArmory = await fetchApi('/v2/legendaryarmory?ids=all');
    const ids = legendaryArmory.map(toId);

    // set all items that have legendary armory info but are not included in this list to null
    const reset = await db.item.updateMany({
      where: { id: { notIn: ids }, legendaryArmoryMaxCount: { not: null }},
      data: { legendaryArmoryMaxCount: null }
    });

    // update max_count for all items
    await db.$transaction(legendaryArmory.map(
      (item) => db.item.update({ where: { id: item.id }, data: { legendaryArmoryMaxCount: item.max_count }})
    ));

    return `Updated legendary armory info for ${reset.count + legendaryArmory.length} items`;
  }
};
