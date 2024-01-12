import { db } from '../../db';
import { batch } from '../helper/batch';
import { Job } from '../job';

export const ItemsViews: Job = {
  run: async () => {
    // get date 24 hours ago
    const past24hours = new Date();
    past24hours.setDate(past24hours.getDate() - 1);

    // get views grouped by item id
    const views = await db.pageView.groupBy({
      by: ['pageId'],
      where: { page: 'item', time: { gte: past24hours }},
      _count: true,
    });

    // create id => views record
    const viewsById: Record<number, number> = Object.fromEntries(views.map(({ pageId, _count }) => [pageId, _count]));

    // get all item ids that have views
    const idsWithViews = views.map(({ pageId }) => pageId!);

    // set all items with 0 views to 0
    await db.$transaction(batch(idsWithViews, 5000).map(
      (ids) => db.item.updateMany({
        where: { id: { notIn: ids }},
        data: { views: 0 }
      })
    ));

    // update views for all items that had views
    for(const ids of batch(idsWithViews, 500)) {
      await db.$transaction(ids.map((id) =>
        db.item.update({ where: { id }, data: { views: viewsById[id] ?? 0 }})
      ));
    }

    return `Updated views for ${idsWithViews.length} items`;
  }
};
