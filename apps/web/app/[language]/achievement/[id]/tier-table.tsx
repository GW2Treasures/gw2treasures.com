'use client';

import type { FC } from 'react';
import styles from './page.module.css';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Icon } from '@gw2treasures/ui';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { AchievementPoints } from '@/components/Achievement/AchievementPoints';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Scope } from '@gw2me/client';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import type { Achievement } from '@gw2api/types/data/achievement';

export interface TierTableProps {
  achievement: Achievement;
  showAccounts?: boolean;
}

const requiredScopes = [Scope.GW2_Progression];

export const TierTable: FC<TierTableProps> = ({ achievement, showAccounts = true }) => {
  const { tiers, flags } = achievement;

  const isRepeatable = flags.includes('Repeatable');
  const totalPoints = tiers.reduce((total, tier) => total + tier.points, 0);
  const pointCap = isRepeatable ? Math.max(0, achievement.point_cap ?? 0) : totalPoints;

  return (
    <Table width="auto">
      <thead>
        <tr>
          <th>Objectives</th>
          {tiers.map((tier) => (
            <th key={tier.count}><FormatNumber value={tier.count}/></th>
          ))}
          <th align="right" className={styles.totalColumn}><b>Total</b></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th><b>Achievement Points</b></th>
          {tiers.map((tier) => (
            <td key={tier.count}><AchievementPoints points={tier.points}/></td>
          ))}
          <td align="right" className={styles.totalColumn}><b><AchievementPoints points={pointCap}/></b></td>
        </tr>
        {showAccounts && (<TierTableAccountRows achievement={achievement}/>)}
      </tbody>
    </Table>
  );
};

const TierTableAccountRows: FC<TierTableProps> = ({ achievement }) => {
  const accounts = useGw2Accounts(requiredScopes);

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <TierTableAccountRow key={account.id} achievement={achievement} account={account}/>
  ));
};

interface TierTableAccountRowProps {
  achievement: Achievement;
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

  const requiresUnlock = achievement.flags.includes('RequiresUnlock');
  const hasUnlock = progress?.unlocked;

  return (
    <tr>
      <th><Gw2AccountName account={account}/></th>
      {achievements.loading ? (
        <td colSpan={tiers.length + 1}><Skeleton/></td>
      ) : achievements.error ? (
        <td colSpan={tiers.length + 1} style={{ color: 'var(--color-error)' }}>Error fetching data</td>
      ) : (
        <>
          {tiers.map((tier, index) => {
            const previousTier = index === 0 ? { points: 0, count: 0 } : tiers[index - 1];
            const isDone = progress && (progress.done || (progress.current ?? 0) >= tier.count);
            const isCurrent = progress && !isDone && (progress.current ?? 0) >= previousTier.count;
            const percentage = isDone ? 1 : isCurrent ? (((progress.current ?? 0) - previousTier.count) / (tier.count - previousTier.count)) : 0;

            return (
              <ProgressCell key={tier.count} progress={percentage}>
                {isDone ? <Icon icon="checkmark"/> : isCurrent ? <><FormatNumber value={progress.current}/> / <FormatNumber value={tier.count}/></> : null}
              </ProgressCell>
            );
          })}
          <td align="right" className={styles.totalColumn}>
            {requiresPrerequisites && !hasPrerequisites ? (
              <Tip tip="Missing prerequisites"><Icon icon="lock"/></Tip>
            ) : (requiresUnlock && !hasUnlock ? (
              <Tip tip="Missing unlock"><Icon icon="lock"/></Tip>
            ) : (
              <>
                {progress?.repeated && `(↻ ${progress.repeated}) `}
                <AchievementPoints points={earnedPoints}/>
              </>
            ))}
          </td>
        </>
      )}
    </tr>
  );
};
