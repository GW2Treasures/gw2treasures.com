import { Table } from '@/components/Table/Table';
import { Headline } from '@/components/Headline/Headline';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { PageLayout } from '@/components/Layout/PageLayout';
import { cookies } from 'next/headers';
import { Reload } from '@/components/Reload/Reload';

export const revalidate = 60;

async function getJobs() {
  // force dynamic rendering, because the db is not availabe at build time
  const c = cookies();

  const [running, finished] = await Promise.all([
    db.job.findMany({ where: { OR: [{ state: { in: ['Running', 'Queued'] }}, { cron: { not: '' }}] }, orderBy: [{ priority: 'desc' }, { scheduledAt: 'asc' }] }),
    db.job.findMany({ where: { state: { notIn: ['Running', 'Queued'] }}, orderBy: { finishedAt: 'desc' }}),
  ]);

  return { running, finished, now: new Date() };
}

async function JobPage() {
  const { running, finished, now } = await getJobs();

  return (
    <PageLayout>
      <Reload intervalMs={1000}/>
      <Headline id="jobs">Active Jobs ({running.length})</Headline>
      <Table>
        <thead>
          <tr>
            <th {...{ width: 1 }}>Status</th>
            <th>Job</th>
            <th {...{ width: 1 }}>Runtime</th>
            <th {...{ width: 1 }}>Scheduled</th>
          </tr>
        </thead>
        <tbody>
          {running.map((job) => (
            <tr key={job.id}>
              <td>{job.state === 'Running' ? 'Running' : 'Queued'}</td>
              <th><b>{job.type}</b></th>
              <td>{job.state === 'Running' ? <><FormatNumber key={job.id} value={Math.round((now.valueOf() - job.startedAt!.valueOf()) / 1000)}/>s</> : '-'}</td>
              <td><FormatDate key={job.id} date={job.scheduledAt} relative data-superjson/></td>
            </tr>
          ))}
          {running.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center' }}>No jobs currently running</td></tr>}
        </tbody>
      </Table>

      <Headline id="jobs">Finished Jobs</Headline>
      <Table>
        <thead>
          <tr>
            <th {...{ width: 1 }}>Status</th>
            <th {...{ width: 1 }}>Job</th>
            <th>Output</th>
            <th {...{ width: 1 }}>Runtime</th>
            <th {...{ width: 1 }}>Finished</th>
          </tr>
        </thead>
        <tbody>
          {finished.map((job) => (
            <tr key={job.id}>
              <td>{job.state}</td>
              <th><b>{job.type}</b></th>
              <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{job.output}</td>
              <td><FormatNumber value={(job.finishedAt!.valueOf() - job.startedAt!.valueOf()) / 1000}/>s</td>
              <td><FormatDate date={job.finishedAt} relative data-superjson/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
};

export default JobPage;

