import Link from 'next/link';
import type { FC } from 'react';
import styles from './Banner.module.css';
import { Icon } from '@gw2treasures/ui';
import { Trans } from '@/components/I18n/Trans';

export const IncursiveInvestigationBanner: FC = () => {
  return (
    <Link href="/incursive-investigation" className={styles.banner}>
      <Icon icon="hand"/>
      <span className={styles.content}>
        <Trans id="incursive-investigation.banner"/>
      </span>
      <Icon icon="chevron-right"/>
    </Link>
  );
};


// related achievement categories that should display the banner
export const incursiveInvestigationAchievementCategoryIds = [
  461, // Incursive Investigation
  462, // Fractal Incursion (bonus event)
];

// related items that should display the banner
export const incursiveInvestigationItemIds = [
  105336, // Fractalline Dust
  105311, // Eikasia, Mists-Grasper Choice
];
