'use client';

import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { FC } from 'react';
import type { ArmorSlot } from './types';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Gw2ApiErrorBadge } from '@/components/Gw2Api/api-error-badge';

export interface LegendaryArmorOverviewCellProps {
  accountId: string,
  itemIdsBySlot: Record<ArmorSlot, number[]>,
}

export const LegendaryArmorOverviewCell: FC<LegendaryArmorOverviewCellProps> = ({ accountId, itemIdsBySlot }) => {
  // TODO: only subscribe to legendary armory
  const inventory = useSubscription('inventories', accountId);

  if(inventory.loading) {
    return <td><Skeleton/></td>;
  }

  if(inventory.error) {
    return <td><Gw2ApiErrorBadge/></td>;
  }

  const legendaryArmory = inventory.data.armory;

  const unlocked = Object.values(itemIdsBySlot)
    .filter((itemIds) => legendaryArmory.some(({ id }) => itemIds.includes(id)))
    .length;

  return (
    <ProgressCell progress={unlocked / 6}>
      {unlocked} / 6
    </ProgressCell>
  );
};
