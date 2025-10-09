import { Icon } from '@gw2treasures/ui';
import type { FC } from 'react';
import styles from './api-error-badge.module.css';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';

export const Gw2ApiErrorBadge: FC = () => {
  return (
    <Tip tip="Could not load data from the official Guild Wars 2 API.">
      <span className={styles.badge}>
        <Icon icon="api-status"/>
        <span>API Error</span>
      </span>
    </Tip>
  );
};
