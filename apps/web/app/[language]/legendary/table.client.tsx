'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Gw2ApiErrorBadge } from '@/components/Gw2Api/api-error-badge';
import { useGw2Account } from '@/components/Gw2Api/use-gw2-account';
import { useInventoryItem, UseInventoryItemAccountLocation } from '@/components/Inventory/use-inventory';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { FC } from 'react';

interface LegendaryArmoryCellProps {
  itemId: number,
  maxCount: number | null,
}

export const LegendaryArmoryCell: FC<LegendaryArmoryCellProps> = ({ itemId, maxCount }) => {
  const { id: accountId } = useGw2Account();
  // TODO: only subscribe to legendary armory
  const inventory = useInventoryItem(accountId, itemId);

  if(inventory.loading) {
    return <td><Skeleton/></td>;
  }

  if(inventory.error) {
    return (<td><Gw2ApiErrorBadge/></td>);
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
