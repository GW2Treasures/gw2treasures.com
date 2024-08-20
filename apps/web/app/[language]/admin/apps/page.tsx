import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { cache, Suspense, type FC } from 'react';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';
import { Code } from '@/components/Layout/Code';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { ensureUserIsAdmin } from '../admin';
import { List } from '@gw2treasures/ui/components/Layout/List';
import { scaleLinear, scaleTime } from '@visx/scale';
import { extent, groups, max } from 'd3-array';
import { Group } from '@visx/group';
import { Line, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Skeleton } from '@/components/Skeleton/Skeleton';

const getApplications = cache(() => {
  const lastDay = new Date();
  lastDay.setHours(lastDay.getHours() - 24);

  return db.application.findMany({
    include: {
      owner: { select: { name: true }},
      _count: { select: { requests: { where: { time: { gte: lastDay }}}}}
    },
    orderBy: { createdAt: 'asc' }
  });
});

export default async function AdminUserPage() {
  await ensureUserIsAdmin();
  const apps = await getApplications();
  const Apps = createDataTable(apps, ({ id }) => id);

  return (
    <PageLayout>
      <Headline id="requests">API Requests</Headline>

      <Suspense fallback={<Skeleton height={300} width={1200}/>}>
        <Chart/>
      </Suspense>

      <Headline id="apps" actions={<ColumnSelect table={Apps}/>}>Applications ({apps.length})</Headline>

      <Apps.Table>
        <Apps.Column id="name" title="Name" sortBy="name">
          {({ name }) => name}
        </Apps.Column>
        <Apps.Column id="owner" title="Owner" sortBy={({ owner }) => owner.name}>
          {({ owner }) => owner.name}
        </Apps.Column>
        <Apps.Column id="apiKey" title="API key">
          {({ apiKey }) => <Code inline>{apiKey}</Code>}
        </Apps.Column>
        <Apps.Column id="origins" title="Origins" sortBy={({ origins }) => origins.length} hidden>
          {({ origins }) => <List>{origins.map((origin) => <li key={origin}>{origin}</li>)}</List>}
        </Apps.Column>
        <Apps.Column id="requests" align="right" title="Requests (24h)" sortBy={({ _count }) => _count.requests}>
          {({ _count }) => <FormatNumber value={_count.requests}/>}
        </Apps.Column>
        <Apps.Column id="createdAt" align="right" title="Created At" sortBy="createdAt">
          {({ createdAt }) => <FormatDate date={createdAt}/>}
        </Apps.Column>
      </Apps.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Applications'
};

const colorPalette = [
  '#33A8C7',
  '#9336FD',
  '#52E3E1',
  '#D883FF',
  '#A0E426',
  '#F050AE',
  '#FDF148',
  '#F77976',
  '#FFAB00',
];

const Chart: FC = async () => {
  const requests = await db.$queryRaw<{ bucket: Date, endpoint: string, count: number }[]>`
      SELECT
        time_bucket_gapfill('1 hour'::INTERVAL, time) AS bucket,
        endpoint,
        COUNT(*)::int AS count
      FROM "ApplicationApiRequest"
      WHERE time >= NOW() - '7 day'::INTERVAL  AND time <= NOW()
      GROUP BY bucket, endpoint
      ORDER BY bucket`;

  const margin = { top: 20, bottom: 40, left: 60, right: 0 };
  const width = 1200;
  const height = 300;

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const requestScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, max(requests, ({ count }) => count) ?? 0],
  });

  const timeScale = scaleTime({
    range: [0, xMax],
    round: true,
    domain: extent(requests, ({ bucket }) => bucket) as [Date, Date],
  });

  const byEndpoint = groups(requests, ({ endpoint }) => endpoint);

  return (
    <FlexRow>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={requestScale} width={xMax} height={yMax} numTicks={6} stroke="var(--color-border)"/>
          <AxisLeft scale={requestScale} stroke="var(--color-border-dark)" tickStroke="var(--color-border-dark)" numTicks={6} tickLabelProps={{ fill: 'var(--color-text)', fontFamily: 'var(--font-wotfard)', fontSize: 12 }}/>
          <AxisBottom scale={timeScale} top={yMax} stroke="var(--color-border-dark)" tickStroke="var(--color-border-dark)" tickLabelProps={{ fill: 'var(--color-text)', fontFamily: 'var(--font-wotfard)', fontSize: 12 }} numTicks={7}/>
          <Line from={{ x: xMax, y: 0 }} to={{ x: xMax, y: yMax }} stroke="var(--color-border)"/>

          {byEndpoint.map(([endpoint, values], index) => (
            <LinePath key={endpoint} data={values} y={(d) => requestScale(d.count ?? 0)} x={(d) => timeScale(d.bucket)} curve={curveMonotoneX} stroke={colorPalette[index % colorPalette.length]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
          ))}
        </Group>
      </svg>
      <Table width="auto">
        <thead>
          <tr><th>Endpoint</th><th>Count</th></tr>
        </thead>
        <tbody>
          {byEndpoint.map(([endpoint, values], index) => (
            <tr key={endpoint}>
              <th><span style={{ backgroundColor: colorPalette[index % colorPalette.length], width: 8, height: 8, borderRadius: 8, display: 'inline-block' }}/> {endpoint}</th>
              <td>{values.filter(({ count }) => count > 0).length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </FlexRow>
  );
};
