'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import { Icon } from '@gw2treasures/ui';
import type { FC } from 'react';

export interface MiniAccountUnlockCellProps {
  accountId: string;
  miniId: number;
}

export const requiredScopes = [Scope.GW2_Account, Scope.GW2_Unlocks];

export const MiniAccountUnlockCell: FC<MiniAccountUnlockCellProps> = ({ accountId, miniId }) => {
  const unlockedMinis = useSubscription('minis', accountId);

  if(unlockedMinis.loading) {
    return (<td><Skeleton/></td>);
  }

  if(unlockedMinis.error) {
    return (<td style={{ color: 'var(--color-error)' }}>Error loading mini unlocks from Guild Wars 2 API</td>);
  }

  const unlocked = unlockedMinis.data.includes(miniId);

  return (
    <ProgressCell progress={unlocked ? 1 : 0}>
      <Icon icon={unlocked ? 'checkmark' : 'cancel'}/>
    </ProgressCell>
  );
};
