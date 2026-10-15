'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { useGw2Account } from '@/components/Gw2Api/use-gw2-account';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import { Icon } from '@gw2treasures/ui';
import type { FC } from 'react';
import { Gw2ApiErrorBadge } from '../Gw2Api/api-error-badge';

export interface SkinAccountUnlockCellProps {
  skinId: number,
}

export const requiredScopes = [Scope.GW2_Account, Scope.GW2_Unlocks];

export const SkinAccountUnlockCell: FC<SkinAccountUnlockCellProps> = ({ skinId }) => {
  const { id: accountId } = useGw2Account();
  const unlockedSkins = useSubscription('skins', accountId);

  if(unlockedSkins.loading) {
    return (<td><Skeleton/></td>);
  }

  if(unlockedSkins.error) {
    return (<td><Gw2ApiErrorBadge/></td>);
  }

  const unlocked = unlockedSkins.data.includes(skinId);

  return (
    <ProgressCell progress={unlocked ? 1 : 0}>
      <Icon icon={unlocked ? 'checkmark' : 'cancel'}/>
    </ProgressCell>
  );
};
