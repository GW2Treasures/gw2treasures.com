'use client';

import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Scope } from '@gw2me/client';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { type FC } from 'react';
import type { Gw2Account } from '../Gw2Api/types';
import { Skeleton } from '../Skeleton/Skeleton';
import { FormatNumber } from '../Format/FormatNumber';
import { Icon } from '@gw2treasures/ui';
import { sumItemCount, useInventoryItem, UseInventoryItemAccountLocation, UseInventoryItemCharacterLocation, type UseInventoryItemResultLocation } from '../Inventory/use-inventory';
import styles from './ItemInventoryTable.module.css';
import { isTruthy } from '@gw2treasures/helper/is';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import { ProfessionIcon } from '../Profession/icon';

interface WardrobeProps {
  itemId: number,
}

const requiredScopes = [
  // always required
  Scope.GW2_Account,

  // get all the characters
  Scope.GW2_Characters,

  // get inventories
  Scope.GW2_Inventories,

  // legendary armory
  Scope.GW2_Unlocks,

  // delivered items waiting for pickup
  Scope.GW2_Tradingpost,
];

export const ItemInventoryTable: FC<WardrobeProps> = ({ itemId }) => {
  return (
    <Gw2Accounts requiredScopes={requiredScopes} authorizationMessage="Authorize gw2treasures.com to see your account and characters inventories.">
      {(accounts) => (
        <Table>
          <thead>
            <tr>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell align="right" small>Count</Table.HeaderCell>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <ItemInventoryAccountRows key={account.id} itemId={itemId} account={account}/>
            ))}
          </tbody>
        </Table>
      )}
    </Gw2Accounts>
  );
};

interface ItemInventoryAccountRowsProps {
  itemId: number,
  account: Gw2Account,
}

const ItemInventoryAccountRows: FC<ItemInventoryAccountRowsProps> = ({ itemId, account }) => {
  const inventory = useInventoryItem(account.id, itemId);
  const [expanded, setExpanded] = useLocalStorageState(`inventory.${account.id}.expanded`, true);

  if(inventory.loading) {
    return (
      <tr>
        <th style={{ color: 'var(--color-text-muted)' }}>
          <FlexRow>
            <Icon icon="loading"/>
            <Gw2AccountName account={account}/>
          </FlexRow>
        </th>
        <td align="right"><Skeleton/></td>
      </tr>
    );
  }

  if(inventory.error) {
    return (
      <tr>
        <th style={{ color: 'var(--color-text-muted)' }}>
          <FlexRow>
            <Icon icon="close"/>
            <Gw2AccountName account={account}/>
          </FlexRow>
        </th>
        <td style={{ color: 'var(--color-error)' }}>Error loading inventory</td>
      </tr>
    );
  }

  const total = inventory.locations.reduce(sumItemCount, 0);

  return (
    <>
      <tr>
        <th>
          <button className={styles.button} onClick={() => setExpanded(!expanded)} disabled={total === 0} aria-expanded={total > 0 ? expanded : undefined}>
            <Icon icon="chevron-right" className={styles.chevron}/>
            <Gw2AccountName account={account}/>
          </button>
        </th>
        <td align="right"><FormatNumber className={total === 0 ? styles.totalCountZero : styles.totalCount} value={total}/></td>
      </tr>

      {expanded && inventory.locations.map((location) => (
        <tr key={locationKey(location)}>
          <td className={styles.locationCell}><ItemInventoryLocation location={location}/></td>
          <td align="right"><FormatNumber value={location.count}/></td>
        </tr>
      ))}
    </>
  );
};

interface ItemInventoryLocationProps {
  location: UseInventoryItemResultLocation,
}

const ItemInventoryLocation: FC<ItemInventoryLocationProps> = ({ location }) => {
  switch(location.location) {
    case UseInventoryItemAccountLocation.Bank:
      return <><Icon className={styles.icon} icon="vendor"/>Bank</>;
    case UseInventoryItemAccountLocation.Materials:
      return <><Icon className={styles.icon} icon="material"/>Material Storage</>;
    case UseInventoryItemAccountLocation.SharedInventory:
      return <><Icon className={styles.icon} icon="shared-inventory"/>Shared Inventory</>;
    case UseInventoryItemAccountLocation.LegendaryArmory:
      return <><Icon className={styles.icon} icon="legendary"/>Legendary Armory</>;
    case UseInventoryItemAccountLocation.Delivery:
      return <><Icon className={styles.icon} icon="tradingpost"/>Trading Post <span className={styles.locationInfo}>(Delivery Box)</span></>;

    case UseInventoryItemCharacterLocation.Inventory:
      return <><ProfessionIcon profession={location.character.profession} className={styles.icon}/>{location.character.name} <span className={styles.locationInfo}>(Inventory)</span></>;
    case UseInventoryItemCharacterLocation.Equipment:
      return <><ProfessionIcon profession={location.character.profession} className={styles.icon}/>{location.character.name} <span className={styles.locationInfo}>(Equipped)</span></>;
    case UseInventoryItemCharacterLocation.EquipmentTemplate:
      return <><ProfessionIcon profession={location.character.profession} className={styles.icon}/>{location.character.name} <span className={styles.locationInfo}>(Equipment Template{location.tab && ` "${location.tab}"`})</span></>;

    default:
      return '?';
  }
};

function locationKey(location: UseInventoryItemResultLocation): string {
  return [
    location.location,
    (location.location === UseInventoryItemCharacterLocation.Inventory ||
    location.location === UseInventoryItemCharacterLocation.Equipment ||
    location.location === UseInventoryItemCharacterLocation.EquipmentTemplate) &&
      location.character.name,
    location.location === UseInventoryItemCharacterLocation.EquipmentTemplate &&
      location.tab
  ].filter(isTruthy).join(':');
}
