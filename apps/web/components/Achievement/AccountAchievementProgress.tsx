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
import type { AchievementFlags } from '@gw2api/types/data/achievement';
import { getResetDate, type Reset } from '../Reset/ResetTimer';

const requiredScopes = [Scope.GW2_Progression];

export interface RowProps {
  achievement: Pick<Achievement, 'id' | 'flags' | 'prerequisitesIds'>;
  bitId?: number;
}
export interface AccountAchievementProgressCellProps extends RowProps {
  accountId: string;
}

export const AccountAchievementProgressHeader: FC = () => <Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>;

export const AccountAchievementProgressRow: FC<RowProps> = ({ achievement, bitId }) => (
  <Gw2AccountBodyCells requiredScopes={requiredScopes}>
    <AccountAchievementProgressCell achievement={achievement} bitId={bitId} accountId={undefined as never}/>
  </Gw2AccountBodyCells>
);

export const AccountAchievementProgressCell: FC<AccountAchievementProgressCellProps> = ({ achievement, accountId, bitId }) => {
  const achievements = useSubscription('achievements', accountId);
  const lastModified = useAccountModificationDate(accountId);

  if(achievements.loading || lastModified.loading) {
    return (<td><Skeleton/></td>);
  } else if (achievements.error || lastModified.error) {
    return (<td/>);
  }

  // get the reset when this achievement has last reset its progress
  const reset = getResetFromFlags(achievement.flags as AchievementFlags[]);

  // the progress for this achievement is stale if it has a reset date before the last modified date
  const isStale = reset !== undefined && lastModified.date < getResetDate(reset);

  // no progress on stale achievements
  if(isStale) {
    return <td/>;
  }

  const progress = achievements.data.find(({ id }) => id === achievement.id);

  const requiresPrerequisites = achievement.prerequisitesIds.length > 0;
  const hasPrerequisites = !achievements.loading && !achievements.error &&
    achievement.prerequisitesIds
      .map((prerequisitesId) => achievements.data.find(({ id }) => prerequisitesId === id))
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

interface SnapshotRowProps extends RowProps {
  snapshots: AchievementProgressSnapshot[];
}

export const AccountAchievementProgressSnapshotRow: FC<SnapshotRowProps> = ({ snapshots, achievement, bitId }) => snapshots.map((snapshot) => (
  <AccountAchievementProgressSnapshotCell key={snapshot[0]} achievement={achievement} bitId={bitId} snapshot={snapshot}/>
));

interface SnapshotCellProps extends RowProps {
  snapshot: AchievementProgressSnapshot;
}

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
