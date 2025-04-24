'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { useInventoryItem, UseInventoryItemAccountLocation } from '@/components/Inventory/use-inventory';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { FC } from 'react';

interface LegendaryArmoryCellProps {
  itemId: number;
  accountId: string;
  maxCount: number | null;
}

export const LegendaryArmoryCell: FC<LegendaryArmoryCellProps> = ({ itemId, accountId, maxCount }) => {
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

  return (
    <ProgressCell progress={Math.min((legendaryArmory?.count ?? 0) / (maxCount ?? 1), 1)}>
      <FormatNumber value={legendaryArmory?.count ?? 0}/> / <FormatNumber value={maxCount}/>
    </ProgressCell>
  );
};
