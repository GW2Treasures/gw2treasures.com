'use client';

import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { FC } from 'react';
import type { Slot } from './types';
import { Gw2ApiErrorBadge } from '@/components/Gw2Api/api-error-badge';
import { SortableDynamicDataTableCell } from '@gw2treasures/ui/components/Table/DataTable.client';
import type { IconName } from '@gw2treasures/icons';
import { Icon } from '@gw2treasures/ui';
import styles from './overview.module.css';
import type { TranslationSubset } from '@/lib/translate';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import { requiredScopes } from '../helper';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';

const slots: Slot[][] = [['Back'], ['Accessory', 'Accessory'], ['Relic'], ['Amulet'], ['Ring', 'Ring']];

const slotIcons: Record<Slot, IconName> = {
  Back: 'slot-back',
  Accessory: 'legendary-trinket',
  Amulet: 'slot-amulet',
  Ring: 'slot-ring',
  Relic: 'legendary-relic',
};

export interface LegendaryTrinketOverviewProps {
  slotByItemId: Record<number, Slot>,
  translations: TranslationSubset<'item.type.Back' | 'item.type.Relic' | 'item.type.Trinket.Accessory' | 'item.type.Trinket.Amulet' | 'item.type.Trinket.Ring'>,
}

export const LegendaryTrinketOverviewAccountRows: FC<LegendaryTrinketOverviewProps> = ({ slotByItemId, translations }) => {
  const accounts = useGw2Accounts(requiredScopes);

  if (accounts.loading) {
    return <tr><td colSpan={2}><Skeleton/></td></tr>;
  }

  if (accounts.error) {
    return <tr><td colSpan={2}><Gw2ApiErrorBadge/></td></tr>;
  }

  return accounts.accounts.map((account) => (
    <LegendaryTrinketOverviewRow key={account.id} account={account} slotByItemId={slotByItemId} translations={translations}/>
  ));
};

interface LegendaryTrinketOverviewRowProps extends LegendaryTrinketOverviewProps {
  account: Gw2Account,
}

const LegendaryTrinketOverviewRow: FC<LegendaryTrinketOverviewRowProps> = ({ account, slotByItemId, translations }) => (
  <tr>
    <td><Gw2AccountName account={account}/></td>
    <LegendaryTrinketOverviewCell accountId={account.id} slotByItemId={slotByItemId} translations={translations}/>
  </tr>
);

interface LegendaryTrinketOverviewCellProps extends LegendaryTrinketOverviewProps {
  accountId: string,
}

const LegendaryTrinketOverviewCell: FC<LegendaryTrinketOverviewCellProps> = ({ accountId, slotByItemId, translations }) => {
  // TODO: only subscribe to legendary armory
  const inventory = useSubscription('inventories', accountId);

  if(inventory.loading) {
    return <td><Skeleton/></td>;
  }

  if(inventory.error) {
    return <td><Gw2ApiErrorBadge/></td>;
  }

  const legendaryArmory = inventory.data.armory;
  const unlockedSlots = legendaryArmory.reduce((unlockedSlots, { id, count }) => {
    const slot = slotByItemId[id];
    return slot ? { ...unlockedSlots, [slot]: unlockedSlots[slot] + count } : unlockedSlots;
  }, { Back: 0, Accessory: 0, Amulet: 0, Ring: 0, Relic: 0 } as Record<Slot, number>);

  const total = Math.min(1, unlockedSlots.Back) + Math.min(2, unlockedSlots.Accessory) + Math.min(1, unlockedSlots.Amulet) + Math.min(2, unlockedSlots.Ring);

  return (
    <SortableDynamicDataTableCell value={total / slots.length}>
      <td className={styles.cell}>
        {slots.map((slotGroup) => slotGroup.map((slot, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tip key={slot + i} tip={slot === 'Back' ? translations['item.type.Back'] : slot === 'Relic' ? translations['item.type.Relic'] : translations[`item.type.Trinket.${slot}`]}>
            <span className={unlockedSlots[slot] > i ? styles.slotUnlocked : styles.slot}>
              <Icon icon={slotIcons[slot]}/>
            </span>
          </Tip>
        )))}
      </td>
    </SortableDynamicDataTableCell>
  );
};
