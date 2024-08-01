import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { Suspense, type FC } from 'react';
import 'server-only';
import styles from './ReviewCountBadge.module.css';

const getOpenReviews = cache(
  () => db.review.count({ where: { state: 'Open' }}),
  ['open-reviews'],
  { revalidate: 600, tags: ['open-reviews'] }
);

export const ReviewCountBadge: FC = () => {
  return (
    <Suspense>
      <ReviewCountBadgeInternal/>
    </Suspense>
  );
};

const ReviewCountBadgeInternal: FC = async () => {
  const openReviews = await getOpenReviews();

  return openReviews > 0
    ? (<span className={styles.badge}>{openReviews}</span>)
    : null;
};
