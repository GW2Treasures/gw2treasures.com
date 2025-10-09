'use client';

import type { FC } from 'react';
import { Skeleton } from '../Skeleton/Skeleton';
import { Icon } from '@gw2treasures/ui';
import { ProgressCell } from './ProgressCell';
import { useAccountModificationDate, useSubscription } from '../Gw2Api/use-gw2-subscription';
import { Scope } from '@gw2me/client';
import type { Achievement } from '@gw2treasures/database';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '../Gw2Api/Gw2AccountTableCells';
import { FormatNumber } from '../Format/FormatNumber';
import type { AchievementProgressSnapshot } from './share/types';
import common from '@gw2treasures/ui/common.module.css';
import type { AchievementFlags, AchievementTier } from '@gw2api/types/data/achievement';
import { getResetDate, type Reset } from '../Reset/ResetTimer';
import { AchievementProgressType, useAchievementProgressType } from './AchievementProgressTypeContext';
import { AchievementPoints } from './AchievementPoints';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import type { AccountAchievement } from '@gw2api/types/data/account-achievements';
import { Gw2ApiErrorBadge } from '../Gw2Api/api-error-badge';

const requiredScopes = [Scope.GW2_Progression];

// if bitId or type=objectives is set, we don't need points/pointCap/tiers
export type RowProps = (
  ({ bitId: number, type?: undefined } | { bitId?: undefined, type: 'objective' }) & { achievement: Pick<Achievement, 'id' | 'flags' | 'prerequisitesIds'> }
) | (
  { bitId?: undefined, type?: undefined, achievement: Pick<Achievement, 'id' | 'flags' | 'prerequisitesIds' | 'points' | 'pointCap' | 'tiers'> }
);

export type AccountAchievementProgressCellProps = RowProps & {
  accountId: string,
};

export const AccountAchievementProgressHeader: FC = () => <Gw2AccountHeaderCells requiredScopes={requiredScopes} small align="right"/>;

export const AccountAchievementProgressRow: FC<RowProps> = (props) => (
  <Gw2AccountBodyCells requiredScopes={requiredScopes}>
    <AccountAchievementProgressCell {...props} accountId={undefined as never}/>
  </Gw2AccountBodyCells>
);

export const AccountAchievementProgressCell: FC<AccountAchievementProgressCellProps> = ({ accountId, ...props }) => {
  const progressType = useAchievementProgressType();
  const accountAchievements = useSubscription('achievements', accountId);
  const lastModified = useAccountModificationDate(accountId);

  if(accountAchievements.loading || lastModified.loading) {
    return (<td><Skeleton/></td>);
  } else if (accountAchievements.error || lastModified.error) {
    return (<td><Gw2ApiErrorBadge/></td>);
  }

  // get the reset when this achievement has last reset its progress
  const reset = getResetFromFlags(props.achievement.flags as AchievementFlags[]);

  // the progress for this achievement is stale if it has a reset date before the last modified date
  const isStale = reset !== undefined && lastModified.date < getResetDate(reset);

  // no progress on stale achievements
  if(isStale) {
    return <td/>;
  }

  const achievement = {
    prerequisitesIds: props.achievement.prerequisitesIds,
    flags: props.achievement.flags as AchievementFlags[]
  };

  // this component can either show the objective progress or the AP progress
  // this is globally controlled by `useAchievementProgressType()`, but can be overwritten by passing a `type`
  const showObjectiveProgress = props.type === 'objective' || progressType === AchievementProgressType.Objectives;

  // get the progress
  const progress = props.bitId !== undefined
    ? getAchievementBitState(accountAchievements.data, props.achievement.id, props.bitId, achievement)
    : showObjectiveProgress
      ? getAchievementObjectiveState(accountAchievements.data, props.achievement.id, achievement)
      : getAchievementPointState(accountAchievements.data, props.achievement.id, {
          ...achievement,
          tiers: props.achievement.tiers as AchievementTier[],
          points: props.achievement.points,
          pointCap: props.achievement.pointCap
        });

  if(progress.state === 'missing_prerequisites') {
    return (<td><Tip tip="Missing prerequisites"><Icon icon="lock"/></Tip></td>);
  }

  if(progress.state === 'missing_unlock') {
    return (<td><Tip tip="Missing unlock"><Icon icon="lock"/></Tip></td>);
  }

  if(progress.state === 'no_progress') {
    return <td/>;
  }

  if(!showObjectiveProgress) {
    if(progress.state === 'done') {
      return (
        <ProgressCell progress={1} align="right">
          <FlexRow align="space-between">
            <Icon icon="checkmark"/>
            {progress.points && progress.points > 0 && (<AchievementPoints points={progress.points}/>)}
          </FlexRow>
        </ProgressCell>
      );
    }

    return (
      <ProgressCell progress={progress.current / progress.total} align="right">
        <span className={common.nowrap}>
          <FormatNumber value={progress.current}/> / <AchievementPoints points={progress.total}/>
        </span>
      </ProgressCell>
    );
  }

  if(progress.state === 'done') {
    return (<ProgressCell progress={1}><Icon icon="checkmark"/></ProgressCell>);
  }

  return (
    <ProgressCell progress={progress.current / progress.total}>
      <span className={common.nowrap}><FormatNumber value={progress.current ?? 0}/> / <FormatNumber value={progress.total}/></span>
      {progress.repeated && <span className={common.nowrap}><wbr/>{` (↻ ${progress.repeated})`}</span>}
    </ProgressCell>
  );
};

type AchievementStateUnlock =
  | { state: 'missing_unlock' }
  | { state: 'missing_prerequisites' };

// TODO: instead of no_progress/done, always return progress with correct numbers,
//   then check when displaying with `current === 0` or `current === total`.
//   This has the advantage that we always know how many objectives there were, even if its done already.
//   This probably requires a DB schema change so we always know how many objectives an achievement has, even if done or without progress
type AchievementState =
  | AchievementStateUnlock
  | { state: 'no_progress' }
  | { state: 'progress', current: number, total: number, repeated?: number }
  | { state: 'done', points?: number };

interface AchievementDataForState {
  prerequisitesIds: number[],
  flags: AchievementFlags[],
}

interface AchievementDataForPointState extends AchievementDataForState {
  pointCap: number,
  tiers: AchievementTier[],
  points: number,
}

export function getAchievementObjectiveState(
  accountAchievements: AccountAchievement[],
  achievementId: number,
  achievement: AchievementDataForState,
): AchievementState {
  const progress = accountAchievements.find(({ id }) => id === achievementId);

  const unlockState = getAchievementUnlockState(progress, accountAchievements, achievement);
  if(unlockState) {
    return unlockState;
  }

  if(!progress) {
    return { state: 'no_progress' };
  }

  return progress.done
    ? { state: 'done' }
    : { state: 'progress', current: progress.current ?? 0, total: progress.max ?? 1, repeated: progress.repeated };
}


export function getAchievementPointState(
  accountAchievements: AccountAchievement[],
  achievementId: number,
  { pointCap, tiers, points, ...achievement }: AchievementDataForPointState
): AchievementState {
  const progress = accountAchievements.find(({ id }) => id === achievementId);

  const unlockState = getAchievementUnlockState(progress, accountAchievements, achievement);
  if(unlockState) {
    return unlockState;
  }

  if(!progress) {
    return { state: 'no_progress' };
  }

  const repeated = progress?.repeated ?? 0;

  const currentPoints = tiers.reduce((total, tier) => (progress?.current ?? 0) >= tier.count ? total + tier.points : total, 0);
  const earnedPoints = Math.min(pointCap, currentPoints + (repeated * points));

  if(earnedPoints === pointCap) {
    return { state: 'done', points: earnedPoints };
  }

  if(earnedPoints === 0) {
    return { state: 'no_progress' };
  }

  return { state: 'progress', current: earnedPoints, total: pointCap };
}

export function getAchievementBitState(
  accountAchievements: AccountAchievement[],
  achievementId: number,
  bitId: number,
  achievement: AchievementDataForState
): AchievementState {
  const progress = accountAchievements.find(({ id }) => id === achievementId);

  // make sure achievement is unlocked
  const unlockState = getAchievementUnlockState(progress, accountAchievements, achievement);
  if(unlockState) {
    return unlockState;
  }

  const hasBit = progress && (progress.done || progress?.bits?.includes(bitId));

  return { state: hasBit ? 'done' : 'no_progress' };
}

function getAchievementUnlockState(
  progress: AccountAchievement | undefined,
  accountAchievements: AccountAchievement[],
  { prerequisitesIds, flags }: AchievementDataForState
): AchievementStateUnlock | undefined {
  const requiresPrerequisites = prerequisitesIds.length > 0;
  const hasPrerequisites = prerequisitesIds
    .map((prerequisitesId) => accountAchievements.find(({ id }) => prerequisitesId === id))
    .every((prerequisite) => prerequisite?.done);

  const requiresUnlock = flags.includes('RequiresUnlock');
  const hasUnlock = !!(progress?.unlocked || progress?.done || progress?.current);

  if(requiresPrerequisites && !hasPrerequisites) {
    return { state: 'missing_prerequisites' };
  }

  if(requiresUnlock && !hasUnlock) {
    return { state: 'missing_unlock' };
  }

  return undefined;
}

function getResetFromFlags(flags: AchievementFlags[]): Reset | undefined {
  for(const flag of flags) {
    switch (flag) {
      case 'Daily': return 'last-daily';
      case 'Weekly': return 'last-weekly';
      case 'Monthly': return 'last-monthly';
    }
  }

  return undefined;
}

type SnapshotRowProps = RowProps & {
  snapshots: AchievementProgressSnapshot[],
};

export const AccountAchievementProgressSnapshotRow: FC<SnapshotRowProps> = ({ snapshots, ...props }) => snapshots.map((snapshot) => (
  <AccountAchievementProgressSnapshotCell key={snapshot[0]} {...props} snapshot={snapshot}/>
));

type SnapshotCellProps = RowProps & {
  snapshot: AchievementProgressSnapshot,
};

export const AccountAchievementProgressSnapshotCell: FC<SnapshotCellProps> = ({ snapshot, achievement, bitId }) => {
  const [, data] = snapshot;

  const progress = data.find(({ id }) => id === achievement.id);

  const requiresPrerequisites = achievement.prerequisitesIds.length > 0;
  const hasPrerequisites = achievement.prerequisitesIds
    .map((prerequisitesId) => data.find(({ id }) => prerequisitesId === id))
    .every((prerequisite) => prerequisite?.done);

  const requiresUnlock = achievement.flags.includes('RequiresUnlock');
  const hasUnlock = progress?.unlocked;

  if(requiresPrerequisites && !hasPrerequisites) {
    return (<td><Tip tip="Missing prerequisites"><Icon icon="lock"/></Tip></td>);
  }

  if(requiresUnlock && !hasUnlock) {
    return (<td><Tip tip="Missing unlock"><Icon icon="lock"/></Tip></td>);
  }

  if(!progress) {
    return (<td/>);
  }

  if(bitId !== undefined) {
    return progress.done || progress.bits?.includes(bitId)
      ? <ProgressCell progress={1}><Icon icon="checkmark"/></ProgressCell>
      : <td/>;
  }

  return (
    <ProgressCell progress={progress.done ? 1 : (progress.current ?? 0) / (progress.max ?? 1)}>
      {progress.done ? <Icon icon="checkmark"/> : <><FormatNumber value={progress.current ?? 0}/> / <FormatNumber value={progress.max ?? 1}/></>}
      {progress.repeated && ` (↻ ${progress.repeated})`}
    </ProgressCell>
  );
};
