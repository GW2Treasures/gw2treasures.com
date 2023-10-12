'use client';

import { Gw2Api } from 'gw2-api-types';
import { FC } from 'react';
import styles from './page.module.css';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Icon } from '@gw2treasures/ui';
import { useGw2Api } from '@/components/Gw2Api/use-gw2-api';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import { Gw2Account } from '@/components/Gw2Api/types';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { ProgressCell } from '@/components/Achievement/ProgressCell';

export interface TierTableProps {
  achievementId: number;
  tiers: Gw2Api.Achievement['tiers'];
}

export const TierTable: FC<TierTableProps> = ({ achievementId, tiers }) => {
  const accounts = useGw2Accounts();

  return (
    <table className={styles.tierTable}>
      <tbody>
        <tr>
          <th>Objectives</th>
          {tiers.map((tier) => (
            <td key={tier.count}><FormatNumber value={tier.count}/></td>
          ))}
          <td><b>Total</b></td>
        </tr>
        <tr>
          <th>Achievement Points</th>
          {tiers.map((tier) => (
            <td key={tier.count}>{tier.points} <Icon icon="achievement_points"/></td>
          ))}
          <td><b>{tiers.reduce((total, tier) => total + tier.points, 0)} <Icon icon="achievement_points"/></b></td>
        </tr>
        {accounts.map((account) => (
          <TierTableAccountRow key={account.name} achievementId={achievementId} tiers={tiers} account={account}/>
        ))}
      </tbody>
    </table>
  );
};


interface TierTableAccountRowProps {
  achievementId: number;
  tiers: Gw2Api.Achievement['tiers'];
  account: Gw2Account;
}

type Gw2ApiAccountProgression = {
  id: number,
  current: number,
  max: number,
  done: boolean,
  bits?: number[],
  repeated?: boolean,
}[];

const TierTableAccountRow: FC<TierTableAccountRowProps> = ({ achievementId, tiers, account }) => {
  const data = useGw2Api<Gw2ApiAccountProgression>(`/v2/account/achievements?access_token=${account.subtoken}`);
  const progress = data?.find(({ id }) => id === achievementId);

  return (
    <tr key={account.name}>
      <th>{account.name}</th>
      {data === undefined ? <td colSpan={99}><Skeleton/></td> : (
        tiers.map((tier, index) => {
          const previousTier = index === 0 ? { points: 0, count: 0 } : tiers[index - 1];
          const isDone = progress && (progress.done || progress.current >= tier.count);
          const isCurrent = progress && !isDone && progress.current >= previousTier.count;
          const percentage = isDone ? 1 : isCurrent ? ((progress.current - previousTier.count) / (tier.count - previousTier.count)) : 0;

          return (
            <ProgressCell key={tier.count} progress={percentage}>
              {isDone ? <Icon icon="checkmark"/> : isCurrent ? `${progress.current} / ${tier.count}` : null}
            </ProgressCell>
          );
        })
      )}
      <td>{progress && progress.done ? (<Icon icon="checkmark"/>) : `${progress?.current ?? 0} / ${tiers.at(-1)?.count}`}</td>
    </tr>
  );
};
