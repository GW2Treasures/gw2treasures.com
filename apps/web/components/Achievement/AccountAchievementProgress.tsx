'use client';

import type { FC } from 'react';
import { Skeleton } from '../Skeleton/Skeleton';
import { Icon } from '@gw2treasures/ui';
import { useGw2Accounts } from '../Gw2Api/use-gw2-accounts';
import { ProgressCell } from './ProgressCell';
import { useSubscription } from '../Gw2Api/Gw2AccountSubscriptionProvider';
import { Scope } from '@gw2me/client';

const requiredScopes = [Scope.GW2_Progression];

export interface HeaderProps {}
export interface RowProps {
  achievementId: number;
  bitId?: number;
}
export interface AccountAchievementProgressCellProps {
  achievementId: number;
  bitId?: number;
  accountId: string;
}

export const AccountAchievementProgressHeader: FC<HeaderProps> = ({ }) => {
  const accounts = useGw2Accounts(requiredScopes);

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <th key={account.name}>{account.name}</th>
  ));
};

export const AccountAchievementProgressRow: FC<RowProps> = ({ achievementId, bitId }) => {
  const accounts = useGw2Accounts(requiredScopes);

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <AccountAchievementProgressCell key={account.id} achievementId={achievementId} bitId={bitId} accountId={account.id}/>
  ));
};

export const AccountAchievementProgressCell: FC<AccountAchievementProgressCellProps> = ({ achievementId, accountId, bitId }) => {
  const achievements = useSubscription('achievements', accountId);

  if(achievements.loading) {
    return (<td><Skeleton/></td>);
  } else if (achievements.error) {
    return (<td/>);
  }

  const progress = achievements.data.find(({ id }) => id === achievementId);

  if(!progress) {
    return (<td/>);
  }

  if(bitId !== undefined) {
    return progress.done || progress.bits?.includes(bitId)
      ? <ProgressCell progress={1}><Icon icon="checkmark"/></ProgressCell>
      : <td/>;
  }

  return (
    <ProgressCell progress={progress.done ? 1 : progress.current / progress.max}>
      {progress.done ? <Icon icon="checkmark"/> : `${progress.current} / ${progress.max}`}
      {progress.repeated && ` (↻ ${progress.repeated})`}
    </ProgressCell>
  );
};
