'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import { Icon } from '@gw2treasures/ui';
import type { FC } from 'react';
import { Gw2ApiErrorBadge } from '../Gw2Api/api-error-badge';

export interface OutfitAccountUnlockCellProps {
  accountId: string,
  outfitId: number,
}

export const requiredScopes = [Scope.GW2_Account, Scope.GW2_Unlocks];

export const OutfitAccountUnlockCell: FC<OutfitAccountUnlockCellProps> = ({ accountId, outfitId }) => {
  const unlockedOutfits = useSubscription('outfits', accountId);

  if(unlockedOutfits.loading) {
    return (<td><Skeleton/></td>);
  }

  if(unlockedOutfits.error) {
    return (<td><Gw2ApiErrorBadge/></td>);
  }

  const unlocked = unlockedOutfits.data.includes(outfitId);

  return (
    <ProgressCell progress={unlocked ? 1 : 0}>
      <Icon icon={unlocked ? 'checkmark' : 'cancel'}/>
    </ProgressCell>
  );
};
