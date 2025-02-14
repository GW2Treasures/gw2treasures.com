'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { useInventoryItem, UseInventoryItemAccountLocation } from '@/components/Inventory/use-inventory';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { FC } from 'react';

interface LegendaryArmoryCellProps {
  itemId: number;
  accountId: string;
}

export const LegendaryArmoryCell: FC<LegendaryArmoryCellProps> = ({ itemId, accountId }) => {
  // TODO: only subscribe to legendary armory
  const inventory = useInventoryItem(accountId, itemId);

  if(inventory.loading) {
    return <td><Skeleton/></td>;
  }

  if(inventory.error) {
    return <td/>;
  }

  // get items in legendary armory
  const legendaryArmory = inventory.locations.find(
    ({ location }) => location === UseInventoryItemAccountLocation.LegendaryArmory
  );

  // TODO use correct `max_count`
  const max_count = 1;

  return (
    <ProgressCell progress={Math.min(legendaryArmory?.count ?? 0, 1)}>
      <FormatNumber value={legendaryArmory?.count ?? 0}/> / <FormatNumber value={max_count}/>
    </ProgressCell>
  );
};
