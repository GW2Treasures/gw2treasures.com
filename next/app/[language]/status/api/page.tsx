import { FormatNumber } from '@/components/Format/FormatNumber';
import { Json } from '@/components/Format/Json';
import { Headline } from '@/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Reload } from '@/components/Reload/Reload';
import { Table } from '@/components/Table/Table';
import { db } from '@/lib/prisma';
import { Fragment } from 'react';
import styles from './page.module.css';

async function getData() {
  const now = new Date();

  const minus24Hours = new Date();
  minus24Hours.setHours(now.getHours() - 24);

  const apiRequests = await db.apiRequest.findMany({ where: { createdAt: { gte: minus24Hours }}, orderBy: { createdAt: 'desc' }});

  const endpoints: Record<string, { totalResponseTimeMs: number, requests: number, errors: number, lastRequests: boolean[] }> = {};
  const statusCodes: Record<number, number> = {};
  let errors = 0;

  apiRequests.forEach((request) => {
    if(!endpoints[request.endpoint]) {
      endpoints[request.endpoint] = { totalResponseTimeMs: 0, requests: 0, errors: 0, lastRequests: [] };
    }

    endpoints[request.endpoint].totalResponseTimeMs += request.responseTimeMs;
    endpoints[request.endpoint].requests++;
    statusCodes[request.status] = (statusCodes[request.status] ?? 0) + 1;

    if(request.status !== 200) {
      errors++;
      endpoints[request.endpoint].errors++;
    }

    if(endpoints[request.endpoint].lastRequests.length < 100) {
      endpoints[request.endpoint].lastRequests.push(request.status === 200);
    }
  });

  return { total: apiRequests.length, errors, endpoints, statusCodes };
}

export default async function StatusApiPage() {
  const { endpoints, errors, total, statusCodes } = await getData();

  return (
    <PageLayout>
      <Reload intervalMs={1000 * 60}/>

      <Headline id="api-status">Guild Wars 2 API Status</Headline>

      <p>
        <FormatNumber value={total}/> requests and <FormatNumber value={errors}/> errors (<FormatNumber value={errors / total * 100}/>%) in the last 24h.
      </p>

      <Headline id="status-codes">Status Codes (24h)</Headline>
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

      <Headline id="endpoints">Endpoints</Headline>
      <Table>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Requests (24h)</th>
            <th>Avg. Response Time (24h)</th>
            <th>Errors (24h)</th>
            <th {...{ width: 1 }}>Last 100 Requests (24h)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(endpoints).sort(([a], [b]) => a.localeCompare(b)).map(([ endpoint, data ]) => (
            <tr key={endpoint}>
              <th>{endpoint}</th>
              <th><FormatNumber value={data.requests}/></th>
              <td><FormatNumber value={data.totalResponseTimeMs / data.requests / 1000}/>s</td>
              <td><FormatNumber value={data.errors}/> (<FormatNumber value={data.errors / data.requests * 100}/>%)</td>
              <td>
                <div className={styles.bar}>
                  { /* eslint-disable-next-line react/no-array-index-key */}
                  {data.lastRequests.map((success, id) => <span key={id} className={success ? styles.success : styles.error}/>)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}
