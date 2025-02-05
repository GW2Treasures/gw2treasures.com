import { PrismaPromise } from '@gw2treasures/database';
import { db } from '../../db';
import { batch } from './batch';
import { toId } from './toId';

const findManyArg = {
  select: { id: true },
  where: { views: { gt: 0 }}
};

type UpdateManyArgs = {
  where: { id: number } | { id: { in: number[] }},
  data: { views: number }
};

export async function aggregateViews(
  table: 'item' | 'achievement',
  findMany: (arg: typeof findManyArg) => PrismaPromise<{ id: number }[]>,
  updateMany: (arg: UpdateManyArgs) => PrismaPromise<unknown>
) {
  // get date 7 days ago
  const pastWeek = new Date();
  pastWeek.setDate(pastWeek.getDate() - 7);

  // get all ids with >0 page views, because we potentially have to set those to 0
  const withExistingPageViews = await findMany({
    select: { id: true },
    where: { views: { gt: 0 }}
  }).then((ids) => ids.map(toId));

  // get views grouped by id
  const views = await db.pageView_daily.groupBy({
    by: ['page', 'pageId'],
    where: { page: table, bucket: { gte: pastWeek }, pageId: { not: 0 }},
    _sum: { count: true },
  });

  // create id => views record
  const viewsById: Record<number, number> = Object.fromEntries(views.map(
    ({ pageId, _sum }) => [pageId, _sum.count ?? 0]
  ));

  // get all ids that have views
  const idsWithViews = views.map(({ pageId }) => pageId);
  const idsWithoutViews = withExistingPageViews.filter((id) => !idsWithViews.includes(id));

  // set all ids with 0 views to 0 views
  console.log(`  Setting ${idsWithoutViews.length} views to 0`);
  if(idsWithoutViews.length > 0) {
    await db.$transaction(batch(idsWithoutViews, 5000).map(
      (ids) => updateMany({
        where: { id: { in: ids }},
        data: { views: 0 }
      })
    ));
  }

  // update views for all achievements that had views
  console.log(`  Updating ${idsWithViews.length} views`);
  if(idsWithViews.length > 0) {
    for(const ids of batch(idsWithViews, 500)) {
      await db.$transaction(ids.map((id) =>
        updateMany({ where: { id }, data: { views: viewsById[id] }})
      ));
    }
  }

  return `Updated ${idsWithViews.length} ${table} views`;
}
