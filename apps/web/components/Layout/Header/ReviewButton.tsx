import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import type { Language, ReviewQueue } from '@gw2treasures/database';
import { groupByUnique } from '@gw2treasures/helper/group-by';
import { Icon } from '@gw2treasures/ui';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { Suspense, use, type FC } from 'react';
import layoutStyles from '../Layout.module.css';
import styles from './ReviewButton.module.css';
import { Trans } from '@/components/I18n/Trans';

const getOpenReviews = cache(
  async () => {
    const data = await db.review.groupBy({
      by: ['queue'],
      where: { state: 'Open' },
      _count: true,
    });

    const total = data.reduce((sum, { _count }) => sum + _count, 0);

    return Object.fromEntries([
      ...groupByUnique(data, 'queue').entries().map((([q, { _count }]) => [q, _count])),
      ['_total', total]
    ]) as Record<ReviewQueue | '_total', number>;
  },
  ['open-reviews'],
  { revalidate: 600, tags: ['open-reviews'] }
);

export interface ReviewButtonProps {
  language: Language,
}

export const ReviewButton: FC<ReviewButtonProps> = ({ language }) => {
  return (
    <Suspense fallback={<InternalReviewButton language={language} data={undefined}/>}>
      <InternalReviewButton language={language} data={getOpenReviews()}/>
    </Suspense>
  );
};

interface InternalReviewButtonProps extends ReviewButtonProps {
  data: ReturnType<typeof getOpenReviews> | undefined,
}

const InternalReviewButton: FC<InternalReviewButtonProps> = ({ language, data }) => {
  const reviewCounts = data ? use(data) : undefined;

  const button = (
    <LinkButton appearance="menu" href="/review" aria-label="Review">
      <Icon icon="review-queue"/><span className={layoutStyles.responsive}> <Trans language={language} id="review"/><ReviewCountBadge count={reviewCounts?._total} hideEmpty/></span>
    </LinkButton>
  );

  return (
    <DropDown hideTop={false} preferredPlacement="bottom" button={button} arrowColor="var(--color-background-light)">
      <MenuList>
        <div className={styles.description}>
          <Trans language={language} id="review.description"/>
        </div>
        <LinkButton appearance="menu" className={styles.button} href="/review/container-content"><Trans language={language} id="review.queue.ContainerContent"/> <ReviewCountBadge count={reviewCounts?.ContainerContent}/></LinkButton>
        <LinkButton appearance="menu" className={styles.button} href="/review/mystic-forge"><Trans language={language} id="review.queue.MysticForge"/> <ReviewCountBadge count={reviewCounts?.MysticForge}/></LinkButton>
      </MenuList>
    </DropDown>
  );
};

export interface ReviewCountBadgeProps {
  count: number | undefined,
  hideEmpty?: boolean,
}

export const ReviewCountBadge: FC<ReviewCountBadgeProps> = ({ count, hideEmpty = false }) => {
  if(!count && hideEmpty) {
    return null;
  }

  return (
    <span className={styles.badge}>{count ?? 0}</span>
  );
};
