import { NextPage } from 'next';
import { Table } from '../../components/Table/Table';
import { Headline } from '../../components/Headline/Headline';
import { db } from '../../lib/prisma';
import { getServerSideSuperProps, withSuperProps } from '../../lib/superprops';
import { Job } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FormatDate } from '../../components/Format/FormatDate';
import { FormatNumber } from '../../components/Format/FormatNumber';
import { useReload } from '../../lib/useReload';

interface JobPageProps {
  running: Job[];
  finished: Job[];
  now: Date;
}

const JobPage: NextPage<JobPageProps> = ({ running, finished, now }) => {
  const reload = useReload();

  useEffect(() => {
    const interval = setInterval(() => {
      reload();
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <div style={{ margin: '0 16px' }}>
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
              <td style={{ whiteSpace: 'nowrap' }}>{job.state === 'Running' ? <><FormatNumber value={Math.round((now.valueOf() - job.startedAt!.valueOf()) / 1000)}/>s</> : '-'}</td>
              <td><FormatDate date={job.scheduledAt} relative/></td>
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
              <td style={{ whiteSpace: 'nowrap' }}><FormatNumber value={(job.finishedAt!.valueOf() - job.startedAt!.valueOf()) / 1000}/>s</td>
              <td><FormatDate date={job.finishedAt} relative/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export const getServerSideProps = getServerSideSuperProps<JobPageProps>(async ({}) => {
  const [running, finished] = await Promise.all([
    db.job.findMany({ where: { OR: [{ state: { in: ['Running', 'Queued'] }}, { cron: { not: '' }}] }, orderBy: [{ priority: 'desc' }, { scheduledAt: 'asc' }] }),
    db.job.findMany({ where: { state: { notIn: ['Running', 'Queued'] }}, orderBy: { finishedAt: 'desc' }}),
  ]);

  return {
    props: { running, finished, now: new Date() },
  };
});

export default withSuperProps(JobPage);

