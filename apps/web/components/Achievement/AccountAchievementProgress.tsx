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

const requiredScopes = [Scope.GW2_Progression];

// if bitId or type=objectives is set, we don't need points/pointCap/tiers
export type RowProps = (
  ({ bitId: number, type?: undefined } | { bitId?: undefined, type: 'objective' }) & { achievement: Pick<Achievement, 'id' | 'flags' | 'prerequisitesIds'> }
) | (
  { bitId?: undefined, type?: undefined, achievement: Pick<Achievement, 'id' | 'flags' | 'prerequisitesIds' | 'points' | 'pointCap' | 'tiers'> }
);

export type AccountAchievementProgressCellProps = RowProps & {
  accountId: string;
};

export const AccountAchievementProgressHeader: FC = () => <Gw2AccountHeaderCells requiredScopes={requiredScopes} small align="right"/>;

export const AccountAchievementProgressRow: FC<RowProps> = (props) => (
  <Gw2AccountBodyCells requiredScopes={requiredScopes}>
    <AccountAchievementProgressCell {...props} accountId={undefined as never}/>
  </Gw2AccountBodyCells>
);

export const AccountAchievementProgressCell: FC<AccountAchievementProgressCellProps> = ({ accountId, ...props }) => {
  const progressType = useAchievementProgressType();
  const achievements = useSubscription('achievements', accountId);
  const lastModified = useAccountModificationDate(accountId);

  if(achievements.loading || lastModified.loading) {
    return (<td><Skeleton/></td>);
  } else if (achievements.error || lastModified.error) {
    return (<td/>);
  }

  // get the reset when this achievement has last reset its progress
  const reset = getResetFromFlags(props.achievement.flags as AchievementFlags[]);

  // the progress for this achievement is stale if it has a reset date before the last modified date
  const isStale = reset !== undefined && lastModified.date < getResetDate(reset);

  // no progress on stale achievements
  if(isStale) {
    return <td/>;
  }

  const progress = achievements.data.find(({ id }) => id === props.achievement.id);

  const requiresPrerequisites = props.achievement.prerequisitesIds.length > 0;
  const hasPrerequisites = !achievements.loading && !achievements.error &&
    props.achievement.prerequisitesIds
      .map((prerequisitesId) => achievements.data.find(({ id }) => prerequisitesId === id))
      .every((prerequisite) => prerequisite?.done);

  const requiresUnlock = props.achievement.flags.includes('RequiresUnlock');
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

  if(props.bitId !== undefined) {
    return progress.done || progress.bits?.includes(props.bitId)
      ? <ProgressCell progress={1}><Icon icon="checkmark"/></ProgressCell>
      : <td/>;
  }

  if(props.type !== 'objective' && progressType === AchievementProgressType.Points) {
    const repeated = progress?.repeated ?? 0;

    const currentPoints = (props.achievement.tiers as AchievementTier[])
      .reduce((total, tier) => (progress?.current ?? 0) >= tier.count ? total + tier.points : total, 0);
    const earnedPoints = Math.min(props.achievement.pointCap, currentPoints + (repeated * props.achievement.points));

    if(earnedPoints === props.achievement.pointCap) {
      return (
        <ProgressCell progress={1} align="right">
          <FlexRow align="space-between">
            <Icon icon="checkmark"/>
            {earnedPoints > 0 && (<AchievementPoints points={earnedPoints}/>)}
          </FlexRow>
        </ProgressCell>
      );
    }

    if(earnedPoints === 0) {
      return <td/>;
    }

    return (
      <ProgressCell progress={earnedPoints / props.achievement.pointCap} align="right">
        <span className={common.nowrap}>
          <FormatNumber value={earnedPoints}/> / <AchievementPoints points={props.achievement.pointCap}/>
        </span>
      </ProgressCell>
    );
  }

  return (
    <ProgressCell progress={progress.done ? 1 : (progress.current ?? 0) / (progress.max ?? 1)}>
      {progress.done ? <Icon icon="checkmark"/> : <span className={common.nowrap}><FormatNumber value={progress.current ?? 0}/> / <FormatNumber value={progress.max ?? 1}/></span>}
      {progress.repeated && <span className={common.nowrap}><wbr/>{` (↻ ${progress.repeated})`}</span>}
    </ProgressCell>
  );
};

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
  snapshots: AchievementProgressSnapshot[];
};

export const AccountAchievementProgressSnapshotRow: FC<SnapshotRowProps> = ({ snapshots, ...props }) => snapshots.map((snapshot) => (
  <AccountAchievementProgressSnapshotCell key={snapshot[0]} {...props} snapshot={snapshot}/>
));

type SnapshotCellProps = RowProps & {
  snapshot: AchievementProgressSnapshot;
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
