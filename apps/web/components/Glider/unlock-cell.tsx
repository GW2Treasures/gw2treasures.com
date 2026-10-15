'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { useGw2Account } from '@/components/Gw2Api/use-gw2-account';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import { Icon } from '@gw2treasures/ui';
import type { FC } from 'react';
import { Gw2ApiErrorBadge } from '../Gw2Api/api-error-badge';

export interface GliderAccountUnlockCellProps {
  gliderId: number,
}

export const requiredScopes = [Scope.GW2_Account, Scope.GW2_Unlocks];

export const GliderAccountUnlockCell: FC<GliderAccountUnlockCellProps> = ({ gliderId }) => {
  const { id: accountId } = useGw2Account();
  const unlockedGliders = useSubscription('gliders', accountId);

  if(unlockedGliders.loading) {
    return (<td><Skeleton/></td>);
  }

  if(unlockedGliders.error) {
    return (<td><Gw2ApiErrorBadge/></td>);
  }

  const unlocked = unlockedGliders.data.includes(gliderId);

  return (
    <ProgressCell progress={unlocked ? 1 : 0}>
      <Icon icon={unlocked ? 'checkmark' : 'cancel'}/>
    </ProgressCell>
  );
};
