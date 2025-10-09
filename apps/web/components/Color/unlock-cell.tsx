'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import { Icon } from '@gw2treasures/ui';
import type { FC } from 'react';
import { Gw2ApiErrorBadge } from '../Gw2Api/api-error-badge';

export interface ColorAccountUnlockCellProps {
  accountId: string,
  colorId: number,
}

export const requiredScopes = [Scope.GW2_Account, Scope.GW2_Unlocks];

export const ColorAccountUnlockCell: FC<ColorAccountUnlockCellProps> = ({ accountId, colorId }) => {
  const unlockedColors = useSubscription('colors', accountId);

  if(unlockedColors.loading) {
    return (<td><Skeleton/></td>);
  }

  if(unlockedColors.error) {
    return (<td><Gw2ApiErrorBadge/></td>);
  }

  const unlocked = unlockedColors.data.includes(colorId);

  return (
    <ProgressCell progress={unlocked ? 1 : 0}>
      <Icon icon={unlocked ? 'checkmark' : 'cancel'}/>
    </ProgressCell>
  );
};
