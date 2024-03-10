'use client';

import type { Gw2Api } from 'gw2-api-types';
import type { FC } from 'react';
import styles from './page.module.css';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Icon } from '@gw2treasures/ui';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { AchievementPoints } from '@/components/Achievement/AchievementPoints';
import { useSubscription } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import { Scope } from '@gw2me/client';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';

export interface TierTableProps {
  achievement: Gw2Api.Achievement;
}

const requiredScopes = [Scope.GW2_Progression];

export const TierTable: FC<TierTableProps> = ({ achievement }) => {
  const accounts = useGw2Accounts(requiredScopes);
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
          <td align="right" className={styles.totalColumn}><b>Total</b></td>
        </tr>
        <tr>
          <th>Achievement Points</th>
          {tiers.map((tier) => (
            <td key={tier.count}><AchievementPoints points={tier.points}/></td>
          ))}
          <td align="right" className={styles.totalColumn}><b><AchievementPoints points={pointCap}/></b></td>
        </tr>
        {!accounts.loading && !accounts.error && accounts.accounts.map((account) => (
          <TierTableAccountRow key={account.id} achievement={achievement} account={account}/>
        ))}
      </tbody>
    </table>
  );
};


interface TierTableAccountRowProps {
  achievement: Gw2Api.Achievement;
  account: Gw2Account;
}

const TierTableAccountRow: FC<TierTableAccountRowProps> = ({ achievement, account }) => {
  const { tiers, flags } = achievement;
  const achievements = useSubscription('achievements', account.id);

  const progress = !achievements.loading && !achievements.error
    ? achievements.data.find(({ id }) => id === achievement.id)
    : undefined;

  const isRepeatable = flags.includes('Repeatable');
  const totalPoints = tiers.reduce((total, tier) => total + tier.points, 0);
  const pointCap = isRepeatable ? Math.max(0, achievement.point_cap ?? 0) : totalPoints;

  const repeated = progress?.repeated ?? 0;
  const currentPoints = tiers.reduce((total, tier) => (progress?.current ?? 0) >= tier.count ? total + tier.points : total, 0);
  const earnedPoints = Math.min(pointCap, currentPoints + (repeated * totalPoints));

  const requiresPrerequisites = !!achievement.prerequisites?.length;
  const hasPrerequisites = !achievements.loading && !achievements.error &&
    achievement.prerequisites?.map((prerequisitesId) => achievements.data.find(({ id }) => prerequisitesId === id))
      .every((prerequisite) => prerequisite?.done);

  return (
    <tr>
      <th>{account.name}</th>
      {achievements.loading ? (
        <td colSpan={tiers.length + 1}><Skeleton/></td>
      ) : achievements.error ? (
        <td colSpan={tiers.length + 1} style={{ color: 'var(--color-error)' }}>Error fetching data</td>
      ) : (
        <>
          {tiers.map((tier, index) => {
            const previousTier = index === 0 ? { points: 0, count: 0 } : tiers[index - 1];
            const isDone = progress && (progress.done || progress.current >= tier.count);
            const isCurrent = progress && !isDone && progress.current >= previousTier.count;
            const percentage = isDone ? 1 : isCurrent ? ((progress.current - previousTier.count) / (tier.count - previousTier.count)) : 0;

            return (
              <ProgressCell key={tier.count} progress={percentage}>
                {isDone ? <Icon icon="checkmark"/> : isCurrent ? `${progress.current} / ${tier.count}` : null}
              </ProgressCell>
            );
          })}
          <td align="right" className={styles.totalColumn}>
            {requiresPrerequisites && !hasPrerequisites ? (
              <Tip tip="Missing prerequisites"><Icon icon="lock"/></Tip>
            ) : (
              <>
                {progress?.repeated && `(↻ ${progress.repeated}) `}
                <AchievementPoints points={earnedPoints}/>
              </>
            )}
          </td>
        </>
      )}
    </tr>
  );
};
