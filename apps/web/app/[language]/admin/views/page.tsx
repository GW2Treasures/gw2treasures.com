import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { cache } from 'react';
import { db } from '@/lib/prisma';
import { scaleLinear, scaleTime } from '@visx/scale';
import { extent, max } from 'd3-array';
import { Group } from '@visx/group';
import { Line, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { ensureUserIsAdmin } from '../admin';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';

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
    db.$queryRaw<{ bucket: Date, count: number }[]>`
      SELECT
        time_bucket_gapfill(${intervalSize}::INTERVAL, time) AS bucket,
        COUNT(*)::int AS count
      FROM "PageView"
      WHERE time >= ${daysAgo} AND time <= NOW()
      GROUP BY bucket
      ORDER BY bucket`,
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

export default async function AdminUserPage({ searchParams: { interval, days }}: { searchParams: { interval: Interval, days: Days } }) {
  await ensureUserIsAdmin();

  interval = ['hour', 'day'].includes(interval) ? interval : 'hour';
  days = ['7', '30'].includes(days) ? days : '7';

  const { views, mostViewed } = await getViews(interval, days);

  const margin = { top: 20, bottom: 40, left: 60, right: 0 };
  const width = 1200;
  const height = 300;

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const viewScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, max(views, ({ count }) => count) ?? 0],
  });

  const timeScale = scaleTime({
    range: [0, xMax],
    round: true,
    domain: extent(views, ({ bucket }) => bucket) as [Date, Date],
  });

  return (
    <PageLayout>
      <Headline id="reviews" actions={[
        days === '30' ? <LinkButton href={`?interval=${interval}&days=7`}>1 Week</LinkButton> : <LinkButton href={`?interval=${interval}&days=30`}>1 Month</LinkButton>,
        interval === 'hour' ? <LinkButton href={`?interval=day&days=${days}`}>daily</LinkButton> : <LinkButton href={`?interval=hour&days=${days}`}>hourly</LinkButton>,
      ]}
      >
        Page Views (last {days} days)
      </Headline>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={viewScale} width={xMax} height={yMax} numTicks={6} stroke="var(--color-border)"/>
          <AxisLeft scale={viewScale} stroke="var(--color-border-dark)" tickStroke="var(--color-border-dark)" numTicks={6} tickLabelProps={{ fill: 'var(--color-text)', fontFamily: 'var(--font-wotfard)', fontSize: 12 }}/>
          <AxisBottom scale={timeScale} top={yMax} stroke="var(--color-border-dark)" tickStroke="var(--color-border-dark)" tickLabelProps={{ fill: 'var(--color-text)', fontFamily: 'var(--font-wotfard)', fontSize: 12 }} numTicks={7}/>
          <Line from={{ x: xMax, y: 0 }} to={{ x: xMax, y: yMax }} stroke="var(--color-border)"/>

          <LinePath data={views} y={(d) => viewScale(d.count ?? 0)} x={(d) => timeScale(d.bucket)} curve={curveMonotoneX} stroke="var(--color-focus)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
        </Group>
      </svg>

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
