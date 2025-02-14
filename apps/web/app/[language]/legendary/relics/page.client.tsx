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

  // `Core` is always unlocked
  if(set?.access === 'Core') {
    return <ProgressCell progress={1}><Tip tip="Always unlocked"><Icon icon="checkmark"/></Tip></ProgressCell>;
  }

  if(account.loading) {
    return <td><Skeleton/></td>;
  }

  if(account.error) {
    return <td/>;
  }

  // if the set requires a specific expansion and the account doesn't have it unlocked show lock
  if(set?.access && !account.data.access.includes(set.access)) {
    return <td><Tip tip="Requires expansion"><Icon icon="lock"/></Tip></td>;
  }

  // `SecretsOfTheObscure` is special, because all relics are unlocked by simply having access to the expansion
  if(set?.access === 'SecretsOfTheObscure') {
    return <ProgressCell progress={1}><Tip tip="Requires expansion"><Icon icon="checkmark"/></Tip></ProgressCell>;
  }

  // otherwise check achievement
  return (
    <AccountAchievementProgressCell accountId={accountId} {...props}/>
  );
};
