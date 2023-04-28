import { FormatNumber } from '@/components/Format/FormatNumber';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Table } from '@/components/Table/Table';
import { db } from '@/lib/prisma';
import { ApiRequest } from '@gw2treasures/database';
import { Fragment } from 'react';
import styles from './page.module.css';
import { ReloadCheckbox } from '@/components/Reload/ReloadCheckbox';
import { PeriodSelect } from './period-select';
import { availablePeriods } from './available-periods';
import { Tip } from '@/components/Tip/Tip';

async function getData(hours: number) {
  const now = new Date();

  const past = new Date();
  past.setHours(now.getHours() - hours);

  const apiRequests = await db.apiRequest.findMany({ where: { createdAt: { gte: past }}, orderBy: { createdAt: 'desc' }});

  const endpoints: Record<string, { totalResponseTimeMs: number, requestCount: number, errors: number, lastRequests: boolean[], requests: ApiRequest[] }> = {};
  const statusCodes: Record<number, number> = {};
  let errors = 0;

  apiRequests.forEach((request) => {
    if(!endpoints[request.endpoint]) {
      endpoints[request.endpoint] = { totalResponseTimeMs: 0, requestCount: 0, errors: 0, lastRequests: [], requests: [] };
    }

    endpoints[request.endpoint].requests.push(request);
    endpoints[request.endpoint].totalResponseTimeMs += request.responseTimeMs;
    endpoints[request.endpoint].requestCount++;
    statusCodes[request.status] = (statusCodes[request.status] ?? 0) + 1;

    if(request.status !== 200) {
      errors++;
      endpoints[request.endpoint].errors++;
    }

    if(endpoints[request.endpoint].lastRequests.length < 100) {
      endpoints[request.endpoint].lastRequests.push(request.status === 200);
    }
  });

  return { total: apiRequests.length, errors, endpoints, statusCodes, apiRequests };
}

export default async function StatusApiPage({ searchParams: { period }}: { searchParams: { period?: string }}) {
  const hours = availablePeriods.find(({ value }) => value === period)?.hours ?? 24;

  const { endpoints, errors, total, statusCodes, apiRequests } = await getData(hours);

  return (
    <PageLayout>
      <Headline id="api-status" actions={[
        <Tip tip="Refresh every minute" key="reload" preferredPlacement="bottom"><ReloadCheckbox intervalMs={1000 * 60}/></Tip>,
        <PeriodSelect key="period"/>
      ]}
      >
        Guild Wars 2 API Status
      </Headline>

      <p>
        <FormatNumber value={total}/> requests and <FormatNumber value={errors}/> errors (<FormatNumber value={errors / total * 100}/>%) in the last {hours} hours.
      </p>

      <Headline id="status-codes">Status Codes ({hours}h)</Headline>
      <div className={styles.statusCodeGrid}>
        {Object.entries(statusCodes).map(([statusCode, amount]) => (
          <Fragment key={statusCode}>
            <div className={styles.statusCode}>{statusCode}</div>
            <div className={styles.statusCodeGraph}>
              <div style={{ width: `${amount / total * 100}%` }} className={statusCode === '200' ? styles.statusCodeBar200 : styles.statusCodeBar}/>
              <div className={styles.statusCodeAmount}>{amount}</div>
            </div>
          </Fragment>
        ))}
      </div>

      <Headline id="endpoints">Endpoints ({hours}h)</Headline>
      <Table>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th align="right">Avg. Response Time</th>
            <th align="right">Requests</th>
            <th>Errors</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(endpoints).sort(([a], [b]) => a.localeCompare(b)).map(([ endpoint, data ]) => (
            <tr key={endpoint}>
              <th>{endpoint}</th>
              <td align="right">
                <FormatNumber value={data.totalResponseTimeMs / data.requestCount / 1000}/>s
                {createResponseTimeGraph(data.requests)}
              </td>
              <td align="right">
                <FormatNumber value={data.requestCount}/>
                {createRequestCountGraph(data.requests)}
              </td>
              <td><FormatNumber value={data.errors}/> (<FormatNumber value={data.errors / data.requestCount * 100}/>%)</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}

function createResponseTimeGraph(requests: ApiRequest[]) {
  const buckets = requests.reduce(toBuckets<ApiRequest>(32, (r) => r.createdAt.valueOf()), [])
    .map((bucket) => bucket ? (bucket.map(({ responseTimeMs }) => responseTimeMs).reduce(average, 0)) : 0);

  const { max, total } = buckets.reduce(({ min, max, total }, bucket) => {
    return { min: min === undefined || min > bucket ? bucket : min, max: max === undefined || max < bucket ? bucket : max, total: (total ?? 0) + bucket };
  }, {} as { min?: number, max?: number, total?: number });

  return (
    <svg height={16} width={128} className={styles.graph} data-max={max} data-avg={(total ?? 0) / buckets.length}>
      {/* eslint-disable-next-line react/no-array-index-key */}
      {buckets.map((bucket, index) => <rect key={index} x={index * 4} width={2} y={16 - Math.ceil((bucket / (max ?? 1)) * 16)} height={Math.ceil((bucket / (max ?? 1)) * 16)} rx={1} data-value={bucket} fill={bucket > 3000 ? '#FFC107' : '#009f2c'}/>)}
    </svg>
  );
}

function createRequestCountGraph(requests: ApiRequest[]) {
  const buckets = requests.reduce(toBuckets<ApiRequest>(32, (r) => r.createdAt.valueOf()), [])
    .map((bucket) => bucket ? (bucket.map(({ status }) => [200, 206].includes(status)).reduce<[number, number]>(([success, error], request) => [request ? success + 1 : success, !request ? error + 1 : error], [0, 0])) : [0, 0]);

  const { max, total } = buckets.map(([s, e]) => s + e).reduce(({ min, max, total }, bucket) => {
    return { min: min === undefined || min > bucket ? bucket : min, max: max === undefined || max < bucket ? bucket : max, total: (total ?? 0) + bucket };
  }, {} as { min?: number, max?: number, total?: number });

  return (
    <svg height={16} width={128} className={styles.graph} data-max={max} data-avg={(total ?? 0) / buckets.length}>
      {buckets.map(([success, error], index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={index}>
          <rect x={index * 4} width={2} y={16 - Math.ceil((success / (max ?? 1)) * 16)} height={Math.ceil((success / (max ?? 1)) * 16)} data-value={success} fill="#009f2c"/>
          <rect x={index * 4} width={2} y={16 - Math.ceil((success / (max ?? 1)) * 16) - Math.ceil((error / (max ?? 1)) * 16)} height={Math.ceil((error / (max ?? 1)) * 16)} data-value={success} fill="#ff0000"/>
        </Fragment>
      ))}
    </svg>
  );
}

function average(previousValue: number, currentValue: number, currentIndex: number, array: number[]) {
  return (previousValue + currentValue) / (currentIndex === array.length - 1 ? array.length : 1);
}

function toBuckets<T>(count: number, by: (value: T) => number): (previousValue: T[][], currentValue: T, currentIndex: number, array: T[]) => T[][] {
  return (previousValue: T[][], currentValue: T, currentIndex: number, array: T[]) => {
    const start = by(array[0]);
    const end = by(array[array.length - 1]);

    const value = by(currentValue);
    const valuePercentage = (value - Math.min(start, end)) / (Math.max(start, end) - Math.min(start, end));

    const bucketIndex = Math.floor(valuePercentage * (count - 1));

    const newValue = [...previousValue];

    if(newValue[bucketIndex] === undefined) {
      newValue[bucketIndex] = [];
    }

    newValue[bucketIndex].push(currentValue);

    return newValue;
  };
}

export const metadata = {
  title: 'API Status'
};
