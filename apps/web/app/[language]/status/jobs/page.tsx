import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { PageLayout } from '@/components/Layout/PageLayout';
import { ReloadCheckbox } from '@/components/Reload/ReloadCheckbox';
import styles from '../page.module.css';
import { cache } from '@/lib/cache';

const getJobs = cache(async () => {
  const [running, finished] = await Promise.all([
    db.job.findMany({ where: { OR: [{ state: { in: ['Running', 'Queued'] }}, { cron: { not: '' }}] }, orderBy: [{ priority: 'desc' }, { scheduledAt: 'asc' }] }),
    db.job.findMany({ where: { state: { notIn: ['Running', 'Queued'] }}, orderBy: { finishedAt: 'desc' }, take: 100 }),
  ]);

  return { running, finished, now: new Date() };
}, ['jobs'], { revalidate: 1 });

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <>
      {minutes > 0 && <><FormatNumber value={minutes} unit="m"/> </>}
      <FormatNumber value={seconds} unit="s"/>
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
            <Table.HeaderCell small>Status</Table.HeaderCell>
            <Table.HeaderCell>Job</Table.HeaderCell>
            <Table.HeaderCell small align="right">Runtime</Table.HeaderCell>
            <Table.HeaderCell small align="right">Scheduled</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {running.map((job) => (
            <tr key={job.id}>
              <td style={{ whiteSpace: 'nowrap' }}><span className={job.state === 'Running' ? styles.running : styles.queued}/>{job.state === 'Running' ? 'Running' : 'Queued'}</td>
              <th><b>{job.type}</b></th>
              <td style={{ whiteSpace: 'nowrap' }} align="right">{job.state === 'Running' ? formatTime(Math.round((now.valueOf() - job.startedAt!.valueOf()) / 1000)) : '-'}</td>
              <td align="right"><FormatDate key={job.id} date={job.scheduledAt} relative/></td>
            </tr>
          ))}
          {running.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center' }}>No jobs currently running</td></tr>}
        </tbody>
      </Table>

      <Headline id="jobs">Finished Jobs ({finished.length})</Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small>Status</Table.HeaderCell>
            <Table.HeaderCell small>Job</Table.HeaderCell>
            <Table.HeaderCell>Output</Table.HeaderCell>
            <Table.HeaderCell small align="right">Runtime</Table.HeaderCell>
            <Table.HeaderCell small align="right">Finished</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {finished.map((job) => (
            <tr key={job.id}>
              <td style={{ whiteSpace: 'nowrap' }}><span className={job.state === 'Error' ? styles.error : styles.success}/>{job.state}</td>
              <th><b>{job.type}</b></th>
              <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{job.output}</td>
              <td align="right" style={{ whiteSpace: 'nowrap' }}>{formatTime((job.finishedAt!.valueOf() - job.startedAt!.valueOf()) / 1000)}</td>
              <td align="right"><FormatDate date={job.finishedAt} relative/></td>
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
