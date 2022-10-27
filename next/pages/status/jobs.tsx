import { NextPage } from 'next';
import { Table } from '../../components/Table/Table';
import { Headline } from '../../components/Headline/Headline';
import { db } from '../../lib/prisma';
import { getServerSideSuperProps, withSuperProps } from '../../lib/superprops';
import { Job } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface JobPageProps {
  running: Job[];
  finished: Job[];
  now: Date;
}

const JobPage: NextPage<JobPageProps> = ({ running, finished, now }) => {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.replace(router.asPath, undefined, { scroll: false });
    }, 1000);

    return () => clearInterval(interval);
  })

  return (
    <div style={{ margin: '0 16px'}}>
      <Headline id="jobs">Active Jobs</Headline>
      <Table>
        <thead>
          <tr>
            <th {...{ width: 1 }}>Status</th>
            <th>Job</th>
            <th {...{ width: 1 }}>Runtime</th>
            <th {...{ width: 1 }}>Scheduled at</th>
          </tr>
        </thead>
        <tbody>
          {running.map((job) => (
            <tr>
              <td>{job.state === 'Running' ? 'Running' : 'Queued'}</td>
              <th><b>{job.type}</b></th>
              <td style={{ whiteSpace: 'nowrap' }}>{job.state === 'Running' ? `${Math.round((now.valueOf() - job.startedAt!.valueOf()) / 1000)}s` : '-'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>{job.scheduledAt?.toLocaleString()}</td>
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
            <tr>
              <td>{job.state}</td>
              <th><b>{job.type}</b></th>
              <td>{job.output}</td>
              <td style={{ whiteSpace: 'nowrap' }}>{((job.finishedAt!.valueOf() - job.startedAt!.valueOf()) / 1000)}s</td>
              <td style={{ whiteSpace: 'nowrap' }}>{job.finishedAt?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export const getServerSideProps = getServerSideSuperProps<JobPageProps>(async ({}) => {
  const [running, finished] = await Promise.all([
    db.job.findMany({ where: { OR: [{ state: { in: ['Running', 'Queued'] } }, { cron: { not: '' } }] }, orderBy: [{ priority: 'desc' }, { scheduledAt: 'asc' }]}),
    db.job.findMany({ where: { state: { notIn: ['Running', 'Queued'] } }, orderBy: { finishedAt: 'desc' }}),
  ]);

  return {
    props: { running, finished, now: new Date() },
  }
});

export default withSuperProps(JobPage);

