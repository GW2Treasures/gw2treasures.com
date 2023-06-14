'use client';

import { FC, useEffect, useState } from 'react';
import { db } from '@/lib/prisma';
import styles from '../Layout.module.css';
import { remember } from '@/lib/remember';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Icon } from '@gw2treasures/ui';
import { getOpenReviews } from './ReviewButton.action';

interface ReviewButtonProps {
  // TODO: define props
};

export const ReviewButton: FC<ReviewButtonProps> = ({ }) => {
  const [openReviews, setOpenReviews] = useState(0);

  useEffect(() => {
    getOpenReviews().then(setOpenReviews);

    const interval = setInterval(
      () => document.visibilityState === 'visible' && getOpenReviews().then(setOpenReviews),
      5 * 60 * 1000 // 5 minutes
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <LinkButton appearance="menu" href="/review">
      <Icon icon="review-queue"/><span className={styles.responsive}> Review {openReviews > 0 && (<span className={styles.badge}>{openReviews}</span>)}</span>
    </LinkButton>
  );
};
