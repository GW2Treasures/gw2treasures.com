import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { cache } from 'react';
import { db } from '@/lib/prisma';
import { scaleLinear, scaleTime } from '@visx/scale';
import { extent, max } from 'd3-array';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { ensureUserIsAdmin } from '../admin';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Chart } from '@/components/Chart/Chart';

type Interval = 'hour' | 'day';
type Days = '7' | '30';

const getViews = cache(async function getViews(interval: Interval, days: Days) {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - Number(days));

  const intervalSize = interval === 'hour' ? '1 hour' : '1 day';

  const [views, mostViewed] = await Promise.all([
    // db.pageView_daily.groupBy({
    //   by: 'bucket',
    //   _sum: { count: true },
    //   where: { bucket: { gte: sevenDaysAgo }},
    //   orderBy: { bucket: 'desc' },
    // }),
    db.$queryRaw<{ time: Date, value: number }[]>`
      SELECT
        time_bucket_gapfill(${intervalSize}::INTERVAL, time) AS "time",
        COUNT(*)::int AS "value"
      FROM "PageView"
      WHERE time >= ${daysAgo} AND time <= NOW()
      GROUP BY 1
      ORDER BY 1`,
    db.pageView_daily.groupBy({
      by: ['page', 'pageId'],
      _sum: { count: true },
      where: { bucket: { gte: daysAgo }},
      orderBy: { _sum: { count: 'desc' }},
      take: 25,
    }),
  ]);

  return { views, mostViewed };
});

export default async function AdminUserPage({ searchParams: { interval, days }}: { searchParams: { interval: Interval, days: Days }}) {
  await ensureUserIsAdmin();

  interval = ['hour', 'day'].includes(interval) ? interval : 'hour';
  days = ['7', '30'].includes(days) ? days : '7';

  const { views, mostViewed } = await getViews(interval, days);

  return (
    <PageLayout>
      <Headline id="reviews" actions={[
        days === '30' ? <LinkButton href={`?interval=${interval}&days=7`}>1 Week</LinkButton> : <LinkButton href={`?interval=${interval}&days=30`}>1 Month</LinkButton>,
        interval === 'hour' ? <LinkButton href={`?interval=day&days=${days}`}>daily</LinkButton> : <LinkButton href={`?interval=hour&days=${days}`}>hourly</LinkButton>,
      ]}
      >
        Page Views (last {days} days)
      </Headline>
      <Chart lines={[['views', views]]}/>

      <Headline id="most-viewed">Most Viewed</Headline>

      <Table>
        <thead>
          <tr>
            <th>Page</th>
            <th>ID</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {mostViewed.map((view) => (
            <tr key={`${view.page}-${view.pageId}`}>
              <td>{view.page}</td>
              <td>{view.pageId}</td>
              <td>{view._sum.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Page Views'
};
