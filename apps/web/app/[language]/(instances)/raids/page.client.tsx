'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Gw2ApiErrorBadge } from '@/components/Gw2Api/api-error-badge';
import { useSubscriptionWithReset } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import { Icon } from '@gw2treasures/ui';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import type { FC } from 'react';
import styles from './page.module.css';

export const requiredScopes = [
  Scope.GW2_Account,
  Scope.GW2_Progression,
];

export interface RaidWingClearCellProps {
  accountId: string,
  events: { id: string, title: string }[],
}

export const RaidWingClearCell: FC<RaidWingClearCellProps> = ({ accountId, events }) => {
  const raids = useSubscriptionWithReset('raids', accountId, 'last-weekly', []);

  if(raids.loading) {
    return (
      <td><Skeleton/></td>
    );
  }

  if(raids.error) {
    return (
      <td><Gw2ApiErrorBadge/></td>
    );
  }

  const state = events.map(({ id }) => raids.data.includes(id));
  const clearedCount = state.filter(Boolean).length;

  const tip = events.map(({ id, title }) => {
    const cleared = raids.data.includes(id);
    return (
      <div key={id} className={styles.tipEvent}>
        <Icon icon={cleared ? 'checkmark' : 'cancel'} color={cleared ? 'var(--color-rarity-masterwork)' : 'var(--color-text-muted)'}/>
        <span style={{ color: !cleared ? 'var(--color-text-muted)' : undefined }}>{title}</span>
      </div>
    );
  });

  return (
    <ProgressCell progress={clearedCount / events.length}>
      <Tip tip={tip}>
        {clearedCount === events.length
          ? (<Icon icon="checkmark"/>)
          : (<span style={{ whiteSpace: 'nowrap' }}>{clearedCount} / {events.length}</span>)}
      </Tip>
    </ProgressCell>
  );
};

export interface RaidEncounterClearCellProps {
  accountId: string,
  bitId: number | undefined,
}

export const RaidEncounterClearCell: FC<RaidEncounterClearCellProps> = ({ accountId, bitId }) => {
  const achievements = useSubscriptionWithReset('achievements', accountId, 'last-weekly', []);

  if (bitId === undefined) {
    return (
      <td>
        <Tip tip="Completion data for this encounter is not available in the official Guild Wars 2 API">
          <span style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>? / 1</span>
        </Tip>
      </td>
    );
  }

  if(achievements.loading) {
    return (
      <td><Skeleton/></td>
    );
  }

  if(achievements.error) {
    return (
      <td><Gw2ApiErrorBadge/></td>
    );
  }

  const achievement = achievements.data.find((a) => a.id === 9125);
  const hasCleared = achievement?.done || achievement?.bits?.includes(bitId);

  return (
    <ProgressCell progress={hasCleared ? 1 : 0}>
      {hasCleared
        ? (<Icon icon="checkmark"/>)
        : (<span style={{ whiteSpace: 'nowrap' }}>0 / 1</span>)
      }
    </ProgressCell>
  );
};

export interface DailyRaidBountyCellProps {
  accountId: string,
  dailyAchievementId: number,
}

export const DailyRaidBountyCell: FC<DailyRaidBountyCellProps> = ({ accountId, dailyAchievementId }) => {
  const achievements = useSubscriptionWithReset('achievements', accountId, 'last-daily', []);

  if(achievements.loading) {
    return (
      <td><Skeleton/></td>
    );
  }

  if(achievements.error) {
    return (
      <td><Gw2ApiErrorBadge/></td>
    );
  }

  const achievement = achievements.data.find((a) => a.id === dailyAchievementId);
  const hasCompleted = achievement?.done;

  return (
    <ProgressCell progress={hasCompleted ? 1 : 0}>
      {hasCompleted && (<Icon icon="checkmark"/>)}
    </ProgressCell>
  );
};
