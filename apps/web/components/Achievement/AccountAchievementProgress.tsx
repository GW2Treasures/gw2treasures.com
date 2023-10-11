'use client';

import { FC, useContext } from 'react';
import { Gw2ApiContext } from '../Gw2Api/Gw2ApiContext';
import { Skeleton } from '../Skeleton/Skeleton';
import { useGw2Api } from '../Gw2Api/use-gw2-api';
import { Icon } from '@gw2treasures/ui';
import styles from './AccountAchievementProgress.module.css';

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
  const { accounts } = useContext(Gw2ApiContext);

  return accounts.map((account) => (
    <th key={account.name}>{account.name}</th>
  ));
};

export const AccountAchievementProgressRow: FC<RowProps> = ({ achievementId, bitId }) => {
  const { accounts } = useContext(Gw2ApiContext);

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
      ? <td className={styles.cell} style={{ '--progress': 1 }}><Icon icon="checkmark"/></td>
      : <td/>;
  }

  return (
    <td className={styles.cell} style={{ '--progress': progress.done ? 1 : progress.current / progress.max }}>
      {progress.done ? <Icon icon="checkmark"/> : `${progress.current} / ${progress.max}`}
      {progress.repeated && ` (↻ ${progress.repeated})`}
    </td>
  );
};
