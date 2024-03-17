'use client';

import { usePageHasActiveSubscriptions } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import type { FC } from 'react';
import styles from './LiveUpdateStatus.module.css';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';

export interface LiveUpdateStatusProps {}

export const LiveUpdateStatus: FC<LiveUpdateStatusProps> = ({}) => {
  const live = usePageHasActiveSubscriptions();

  if(!live) {
    return null;
  }

  return (
    <DropDown hideTop={false} preferredPlacement="bottom" button={<Button appearance="menu"><span className={styles.live}/> Live</Button>}>
      <p>Your account data on this page<br/> is automatically updating.</p>
    </DropDown>
  );
};
