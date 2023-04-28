import { Table } from '@/components/Table/Table';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { PageLayout } from '@/components/Layout/PageLayout';
import { ReloadCheckbox } from '@/components/Reload/ReloadCheckbox';
import { remember } from '@/lib/remember';
import styles from '../page.module.css';

export const revalidate = 3;
export const dynamic = 'force-dynamic';

const getJobs = remember(1, async function getJobs() {
  const [running, finished] = await Promise.all([
    db.job.findMany({ where: { OR: [{ state: { in: ['Running', 'Queued'] }}, { cron: { not: '' }}] }, orderBy: [{ priority: 'desc' }, { scheduledAt: 'asc' }] }),
    db.job.findMany({ where: { state: { notIn: ['Running', 'Queued'] }}, orderBy: { finishedAt: 'desc' }, take: 100 }),
  ]);

  return { running, finished, now: new Date() };
});

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <>
      {minutes > 0 && <><FormatNumber value={minutes}/>m </>}
      <FormatNumber value={seconds}/>s
    </>
  );
}

async function JobPage() {
  const { running, finished, now } = await getJobs();

  return (
    <PageLayout>
      <Headline id="jobs" actions={<ReloadCheckbox intervalMs={1000}/>}>
        Active Jobs ({running.length})
      </Headline>
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
              <td style={{ whiteSpace: 'nowrap' }}><span className={job.state === 'Running' ? styles.running : styles.queued}/>{job.state === 'Running' ? 'Running' : 'Queued'}</td>
              <th><b>{job.type}</b></th>
              <td style={{ whiteSpace: 'nowrap' }}>{job.state === 'Running' ? formatTime(Math.round((now.valueOf() - job.startedAt!.valueOf()) / 1000)) : '-'}</td>
              <td><FormatDate key={job.id} date={job.scheduledAt} relative data-superjson/></td>
            </tr>
          ))}
          {running.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center' }}>No jobs currently running</td></tr>}
        </tbody>
      </Table>

      <Headline id="jobs">Finished Jobs ({finished.length})</Headline>
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
              <td style={{ whiteSpace: 'nowrap' }}><span className={job.state === 'Error' ? styles.error : styles.success}/>{job.state}</td>
              <th><b>{job.type}</b></th>
              <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{job.output}</td>
              <td style={{ whiteSpace: 'nowrap' }}>{formatTime((job.finishedAt!.valueOf() - job.startedAt!.valueOf()) / 1000)}</td>
              <td><FormatDate date={job.finishedAt} relative data-superjson/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
};

export default JobPage;

export const metadata = {
  title: 'Job Status'
};
