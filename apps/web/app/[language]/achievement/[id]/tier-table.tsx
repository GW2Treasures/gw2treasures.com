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
  achievement: Gw2Api.Achievement;
}

export const TierTable: FC<TierTableProps> = ({ achievement }) => {
  const accounts = useGw2Accounts();
  const { tiers, flags } = achievement;

  const isRepeatable = flags.includes('Repeatable');
  const totalPoints = tiers.reduce((total, tier) => total + tier.points, 0);
  const pointCap = isRepeatable ? Math.max(0, achievement.point_cap ?? 0) : totalPoints;

  return (
    <table className={styles.tierTable}>
      <tbody>
        <tr>
          <th>Objectives</th>
          {tiers.map((tier) => (
            <td key={tier.count}><FormatNumber value={tier.count}/></td>
          ))}
          <td align="right"><b>Total</b></td>
        </tr>
        <tr>
          <th>Achievement Points</th>
          {tiers.map((tier) => (
            <td key={tier.count}>{tier.points} <Icon icon="achievement_points"/></td>
          ))}
          <td align="right"><b>{pointCap} <Icon icon="achievement_points"/></b></td>
        </tr>
        {accounts.map((account) => (
          <TierTableAccountRow key={account.name} achievement={achievement} account={account}/>
        ))}
      </tbody>
    </table>
  );
};


interface TierTableAccountRowProps {
  achievement: Gw2Api.Achievement;
  account: Gw2Account;
}

type Gw2ApiAccountProgression = {
  id: number,
  current: number,
  max: number,
  done: boolean,
  bits?: number[],
  repeated?: number,
}[];

const TierTableAccountRow: FC<TierTableAccountRowProps> = ({ achievement, account }) => {
  const { tiers, flags } = achievement;
  const data = useGw2Api<Gw2ApiAccountProgression>(`/v2/account/achievements?access_token=${account.subtoken}`);
  const progress = Array.isArray(data) ? data?.find(({ id }) => id === achievement.id) : undefined;

  const isRepeatable = flags.includes('Repeatable');
  const totalPoints = tiers.reduce((total, tier) => total + tier.points, 0);
  const pointCap = isRepeatable ? Math.max(0, achievement.point_cap ?? 0) : totalPoints;

  const repeated = progress?.repeated ?? 0;
  const currentPoints = tiers.reduce((total, tier) => (progress?.current ?? 0) >= tier.count ? total + tier.points : total, 0);
  const earnedPoints = Math.min(pointCap, currentPoints + (repeated * totalPoints));

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
      <td align="right">
        {progress?.repeated && `(↻ ${progress.repeated}) `}
        {earnedPoints} <Icon icon="achievement_points"/>
      </td>
    </tr>
  );
};
