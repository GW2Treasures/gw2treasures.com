import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { cache } from 'react';
import { db } from '@/lib/prisma';
import { ensureUserIsAdmin } from '../admin';
import { Chart } from '@/components/Chart/Chart';
import { Switch } from '@gw2treasures/ui/components/Form/Switch';
import type { PageProps } from '@/lib/next';

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

export default async function AdminUserPage({ searchParams }: PageProps) {
  await ensureUserIsAdmin();

  const interval = (['hour', 'day']).includes(searchParams.interval as string) ? searchParams.interval as 'hour' | 'day' : 'hour';
  const days = (['7', '30']).includes(searchParams.days as string) ? searchParams.days as '7' | '30' : '7';

  const { views, mostViewed } = await getViews(interval, days);

  return (
    <PageLayout>
      <Headline id="reviews" actions={[
        <Switch key="days">
          <Switch.Control type="link" href={`?interval=${interval}&days=7`} active={days === '7'}>1 Week</Switch.Control>
          <Switch.Control type="link" href={`?interval=${interval}&days=30`} active={days === '30'}>1 Month</Switch.Control>
        </Switch>,
        <Switch key="interval">
          <Switch.Control type="link" href={`?interval=hour&days=${days}`} active={interval === 'hour'}>hourly</Switch.Control>
          <Switch.Control type="link" href={`?interval=day&days=${days}`} active={interval === 'day'}>daily</Switch.Control>
        </Switch>
      ]}
      >
        Page Views (last {days} days)
      </Headline>
      <Chart lines={[['Page Views', views]]}/>

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
