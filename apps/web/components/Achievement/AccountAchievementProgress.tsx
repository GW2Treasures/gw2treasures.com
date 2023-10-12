'use client';

import { FC } from 'react';
import { Skeleton } from '../Skeleton/Skeleton';
import { useGw2Api } from '../Gw2Api/use-gw2-api';
import { Icon } from '@gw2treasures/ui';
import { useGw2Accounts } from '../Gw2Api/use-gw2-accounts';
import { ProgressCell } from './ProgressCell';

export interface HeaderProps {}
export interface RowProps {
  achievementId: number;
  bitId?: number;
}
export interface AccountAchievementProgressCellProps {
  achievementId: number;
  bitId?: number;
  subtoken: string;
}

export const AccountAchievementProgressHeader: FC<HeaderProps> = ({ }) => {
  const accounts = useGw2Accounts();

  return accounts.map((account) => (
    <th key={account.name}>{account.name}</th>
  ));
};

export const AccountAchievementProgressRow: FC<RowProps> = ({ achievementId, bitId }) => {
  const accounts = useGw2Accounts();

  return accounts.map((account) => (
    <AccountAchievementProgressCell achievementId={achievementId} bitId={bitId} subtoken={account.subtoken} key={account.name}/>
  ));
};

type Gw2ApiAccountProgression = {
  id: number,
  current: number,
  max: number,
  done: boolean,
  bits?: number[],
  repeated?: boolean,
}[];

export const AccountAchievementProgressCell: FC<AccountAchievementProgressCellProps> = ({ achievementId, subtoken, bitId }) => {
  const result = useGw2Api<Gw2ApiAccountProgression>(`/v2/account/achievements?access_token=${subtoken}`);

  if(!result) {
    return (<td><Skeleton/></td>);
  } else if (!Array.isArray(result)) {
    return (<td/>);
  }

  const progress = result.find(({ id }) => id === achievementId);

  if(!progress) {
    return (<td/>);
  }

  if(bitId !== undefined) {
    return progress.bits?.includes(bitId)
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
