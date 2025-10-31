'use client';

import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { FC } from 'react';
import type { ArmorSlot } from './types';
import { Gw2ApiErrorBadge } from '@/components/Gw2Api/api-error-badge';
import { SortableDynamicDataTableCell } from '@gw2treasures/ui/components/Table/DataTable.client';
import type { IconName } from '@gw2treasures/icons';
import { Icon } from '@gw2treasures/ui';
import styles from './overview.module.css';
import type { TranslationSubset } from '@/lib/translate';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';

const slots: ArmorSlot[] = ['Helm', 'Shoulders', 'Coat', 'Gloves', 'Leggings', 'Boots', 'HelmAquatic'];

const slotIcons: Record<ArmorSlot, IconName> = {
  Helm: 'legendary-armor',
  Shoulders: 'slot-shoulders',
  Coat: 'skin',
  Gloves: 'hand',
  Leggings: 'slot-leggings',
  Boots: 'slot-boots',
  HelmAquatic: 'slot-helm-aquatic',
};

export interface LegendaryArmorOverviewCellProps {
  accountId: string,
  itemIdsBySlot: Record<ArmorSlot, number[]>,
  translations: TranslationSubset<'item.type.Armor.Helm' | 'item.type.Armor.Shoulders' | 'item.type.Armor.Coat' | 'item.type.Armor.Gloves' | 'item.type.Armor.Leggings' | 'item.type.Armor.Boots' | 'item.type.Armor.HelmAquatic'>,
}

export const LegendaryArmorOverviewCell: FC<LegendaryArmorOverviewCellProps> = ({ accountId, itemIdsBySlot, translations }) => {
  // TODO: only subscribe to legendary armory
  const inventory = useSubscription('inventories', accountId);

  if(inventory.loading) {
    return <td><Skeleton/></td>;
  }

  if(inventory.error) {
    return <td><Gw2ApiErrorBadge/></td>;
  }

  const legendaryArmory = inventory.data.armory;

  const unlockedSlots = Object.fromEntries(slots.map(
    (slot) => [slot, legendaryArmory.some(({ id }) => itemIdsBySlot[slot].includes(id))]
  )) as Record<ArmorSlot, boolean>;

  const unlocked = Object.values(unlockedSlots).filter(Boolean).length;

  return (
    <SortableDynamicDataTableCell value={unlocked / slots.length}>
      <td className={styles.cell}>
        {slots.map((slot) => (
          <Tip key={slot} tip={translations[`item.type.Armor.${slot}`]}>
            <span className={unlockedSlots[slot] ? styles.slotUnlocked : styles.slot}>
              <Icon icon={slotIcons[slot]}/>
            </span>
          </Tip>
        ))}
      </td>
    </SortableDynamicDataTableCell>
  );
};
