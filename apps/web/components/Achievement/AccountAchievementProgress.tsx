'use client';

import type { FC } from 'react';
import { Skeleton } from '../Skeleton/Skeleton';
import { Icon } from '@gw2treasures/ui';
import { ProgressCell } from './ProgressCell';
import { useSubscription } from '../Gw2Api/Gw2AccountSubscriptionProvider';
import { Scope } from '@gw2me/client';
import type { Achievement } from '@gw2treasures/database';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '../Gw2Api/Gw2AccountTableCells';
import { FormatNumber } from '../Format/FormatNumber';

const requiredScopes = [Scope.GW2_Progression];

export interface RowProps {
  achievement: Achievement;
  bitId?: number;
}
export interface AccountAchievementProgressCellProps {
  achievement: Achievement;
  bitId?: number;
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

  if(achievements.loading) {
    return (<td><Skeleton/></td>);
  } else if (achievements.error) {
    return (<td/>);
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
      {progress.done ? <Icon icon="checkmark"/> : <><FormatNumber value={progress.current ?? 0}/> / <FormatNumber value={progress.max ?? 1}/></>}
      {progress.repeated && ` (↻ ${progress.repeated})`}
    </ProgressCell>
  );
};
