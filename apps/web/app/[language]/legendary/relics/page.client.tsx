'use client';

import { AccountAchievementProgressCell, type AccountAchievementProgressCellProps } from '@/components/Achievement/AccountAchievementProgress';
import type { FC } from 'react';
import type { RelicSet } from '../helper';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Icon } from '@gw2treasures/ui';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';

export interface RelicUnlockCellProps extends AccountAchievementProgressCellProps {
  set: RelicSet | undefined
}

export const RelicUnlockCell: FC<RelicUnlockCellProps> = ({ set, accountId, ...props }) => {
  const account = useSubscription('account', accountId);

  if(set?.type === 'Core') {
    return <ProgressCell progress={1}><Tip tip="Always unlocked"><Icon icon="checkmark"/></Tip></ProgressCell>;
  }

  if(account.loading) {
    return <td><Skeleton/></td>;
  }

  if(account.error) {
    return <td/>;
  }

  // TODO check `/v2/account.access` if account has access to SotO
  if(set?.type === 'SotO') {
    const hasSotO = account.data.access.includes('SecretsOfTheObscure');

    if(!hasSotO) {
      return <td><Tip tip="Requires SotO"><Icon icon="lock"/></Tip></td>;
    }

    return <ProgressCell progress={1}><Tip tip="Requires SotO"><Icon icon="checkmark"/></Tip></ProgressCell>;
  }

  return (
    <AccountAchievementProgressCell accountId={accountId} {...props}/>
  );
};
