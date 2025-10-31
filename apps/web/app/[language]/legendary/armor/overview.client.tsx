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

  // TODO: add HelmAquatic, but needs better display (icon per slot?)
  const slots: ArmorSlot[] = ['Helm', 'Shoulders', 'Coat', 'Gloves', 'Leggings', 'Boots'];

  const unlocked = slots
    .filter((slot) => legendaryArmory.some(({ id }) => itemIdsBySlot[slot].includes(id)))
    .length;

  return (
    <ProgressCell progress={unlocked / slots.length}>
      {unlocked} / {slots.length}
    </ProgressCell>
  );
};
