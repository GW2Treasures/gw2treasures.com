import { FormatNumber } from '@/components/Format/FormatNumber';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { db } from '@/lib/prisma';
import Link from 'next/link';
import styles from './page.module.css';

function getStatus() {
  const last30Minutes = new Date();
  last30Minutes.setMinutes(last30Minutes.getMinutes() - 30);

  return Promise.all([
    db.job.count({ where: { state: 'Queued', scheduledAt: { lt: new Date() }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30Minutes }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30Minutes }, status: { notIn: [200, 206] }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30Minutes }, responseTimeMs: { gt: 5000 }}}),
  ]);
}

export default async function StatusPage() {
  const [queuedJobs, apiTotal, apiErrors, apiSlow] = await getStatus();

  const apiErrorsPercentage = apiErrors / apiTotal;
  const apiSlowPercentage = apiSlow / apiTotal;

  const apiErrorThreshold = 0.1;
  const apiSlowThreshold = 0.1;

  return (
    <HeroLayout hero={<Headline id="status">Status</Headline>} color="#2c8566">
      <Link href="/status/jobs" className={styles.statusRow}>
        <span className={queuedJobs > 25 ? styles.running : styles.success}/>
        <span className={styles.statusTitle}>Job Queue</span>
        <span className={styles.statusDescription}>{queuedJobs} queued jobs</span>
      </Link>
      <Link href="/status/api" className={styles.statusRow}>
        <span className={apiErrorsPercentage > apiErrorThreshold ? styles.error : (apiSlowPercentage > apiSlowThreshold ? styles.running : styles.success)}/>
        <span className={styles.statusTitle}>Guild Wars 2 API</span>
        <span className={styles.statusDescription}>
          {apiErrorsPercentage > apiErrorThreshold
            ? <><FormatNumber value={apiErrors}/> errors in the last 30 minutes</>
            : (apiSlowPercentage > apiSlowThreshold
              ? <><FormatNumber value={apiSlow}/> slow requests in the last 30 minutes</>
              : <><FormatNumber value={apiTotal}/> requests in the last 30 minutes</>)}
        </span>
      </Link>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Status'
};
