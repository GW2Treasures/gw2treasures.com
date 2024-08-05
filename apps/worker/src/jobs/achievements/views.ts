import { db } from '../../db';
import { batch } from '../helper/batch';
import { toId } from '../helper/toId';
import { Job } from '../job';

export const AchievementsViews: Job = {
  run: async () => {
    // get date 7 days ago
    const pastWeek = new Date();
    pastWeek.setDate(pastWeek.getDate() - 7);

    // get all ids with >0 page views, because we potentially have to set those to 0
    const allAchievementIdsWithExistingPageViews = await db.achievement.findMany({
      select: { id: true },
      where: { views: { gt: 0 }}
    }).then((ids) => ids.map(toId));

    // get views grouped by achievement id
    const views = await db.pageView_daily.groupBy({
      by: ['page', 'pageId'],
      where: { page: 'achievement', bucket: { gte: pastWeek }, pageId: { not: 0 }},
      _sum: { count: true },
    });

    // create id => views record
    const viewsById: Record<number, number> = Object.fromEntries(views.map(
      ({ pageId, _sum }) => [pageId, _sum.count ?? 0]
    ));

    // get all achievement ids that have views
    const idsWithViews = views.map(({ pageId }) => pageId);
    const idsWithoutViews = allAchievementIdsWithExistingPageViews.filter((id) => !idsWithViews.includes(id));

    // set all achievements with 0 views to 0
    await db.$transaction(batch(idsWithoutViews, 5000).map(
      (ids) => db.achievement.updateMany({
        where: { id: { in: ids }},
        data: { views: 0 }
      })
    ));

    // update views for all achievements that had views
    for(const ids of batch(idsWithViews, 500)) {
      await db.$transaction(ids.map((id) =>
        db.achievement.updateMany({ where: { id }, data: { views: viewsById[id] }})
      ));
    }

    return `Updated views for ${idsWithViews.length} achievements`;
  }
};
