'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { useSubscription } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import { Icon } from '@gw2treasures/ui';
import type { FC } from 'react';

export interface SkinAccountUnlockCellProps {
  accountId: string;
  skinId: number;
};

export const requiredScopes = [Scope.GW2_Account, Scope.GW2_Unlocks];

export const SkinAccountUnlockCell: FC<SkinAccountUnlockCellProps> = ({ accountId, skinId }) => {
  const unlockedSkins = useSubscription('skins', accountId);

  if(unlockedSkins.loading) {
    return (<td><Skeleton/></td>);
  }

  if(unlockedSkins.error) {
    return (<td style={{ color: 'var(--color-error)' }}>Error loading skin unlocks from Guild Wars 2 API</td>);
  }

  const unlocked = unlockedSkins.data.includes(skinId);

  return (
    <ProgressCell progress={unlocked ? 1 : 0}>
      <Icon icon={unlocked ? 'checkmark' : 'cancel'}/>
    </ProgressCell>
  );
};
