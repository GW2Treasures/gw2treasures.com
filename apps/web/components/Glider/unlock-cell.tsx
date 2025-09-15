'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import { Icon } from '@gw2treasures/ui';
import type { FC } from 'react';

export interface GliderAccountUnlockCellProps {
  accountId: string,
  gliderId: number,
}

export const requiredScopes = [Scope.GW2_Account, Scope.GW2_Unlocks];

export const GliderAccountUnlockCell: FC<GliderAccountUnlockCellProps> = ({ accountId, gliderId }) => {
  const unlockedGliders = useSubscription('gliders', accountId);

  if(unlockedGliders.loading) {
    return (<td><Skeleton/></td>);
  }

  if(unlockedGliders.error) {
    return (<td style={{ color: 'var(--color-error)' }}>Error loading glider unlocks from Guild Wars 2 API</td>);
  }

  const unlocked = unlockedGliders.data.includes(gliderId);

  return (
    <ProgressCell progress={unlocked ? 1 : 0}>
      <Icon icon={unlocked ? 'checkmark' : 'cancel'}/>
    </ProgressCell>
  );
};
