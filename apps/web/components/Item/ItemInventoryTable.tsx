'use client';

import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Scope } from '@gw2me/client';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import type { FC } from 'react';
import type { Gw2Account } from '../Gw2Api/types';
import { Skeleton } from '../Skeleton/Skeleton';
import { FormatNumber } from '../Format/FormatNumber';
import { Icon } from '@gw2treasures/ui';
import { useInventoryItem, UseInventoryItemAccountLocation, UseInventoryItemCharacterLocation, type UseInventoryItemResultLocation } from '../Inventory/use-inventory';

interface WardrobeProps {
  itemId: number;
}

const requiredScopes = [
  // always required
  Scope.GW2_Account,

  // get all the characters
  Scope.GW2_Characters,

  // get inventories
  Scope.GW2_Inventories,

  // legendary armory
  Scope.GW2_Unlocks
];

export const ItemInventoryTable: FC<WardrobeProps> = ({ itemId }) => {
  return (
    <Gw2Accounts requiredScopes={requiredScopes} authorizationMessage="Authorize gw2treasures.com to see your account and characters inventories.">
      {(accounts) => (
        <Table>
          <thead>
            <tr>
              <Table.HeaderCell>Account</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell align="right">Count</Table.HeaderCell>
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
  itemId: number;
  account: Gw2Account;
}

const ItemInventoryAccountRows: FC<ItemInventoryAccountRowsProps> = ({ itemId, account }) => {
  const inventory = useInventoryItem(account.id, itemId);

  if(inventory.loading) {
    return (
      <tr>
        <th><Gw2AccountName account={account}/></th>
        <td><Skeleton/></td>
        <td align="right"><Skeleton/></td>
      </tr>
    );
  }

  if(inventory.error) {
    return (
      <tr>
        <th><Gw2AccountName account={account}/></th>
        <td colSpan={2} style={{ color: 'var(--color-error)' }}>Error loading inventory</td>
      </tr>
    );
  }

  if(inventory.locations.length === 0) {
    return (
      <tr>
        <th><Gw2AccountName account={account}/></th>
        <td>-</td>
        <td align="right">0</td>
      </tr>
    );
  }

  return inventory.locations.map((location, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <tr key={index}>
      <th><Gw2AccountName account={account}/></th>
      <td><ItemInventoryLocation location={location}/></td>
      <td align="right"><FormatNumber value={location.count}/></td>
    </tr>
  ));
};

interface ItemInventoryLocationProps {
  location: UseInventoryItemResultLocation;
}

const ItemInventoryLocation: FC<ItemInventoryLocationProps> = ({ location }) => {
  switch(location.location) {
    case UseInventoryItemAccountLocation.Bank:
      return 'Bank';
    case UseInventoryItemAccountLocation.Materials:
      return 'Material Storage';
    case UseInventoryItemAccountLocation.SharedInventory:
      return 'Shared Inventory';
    case UseInventoryItemAccountLocation.LegendaryArmory:
      return 'Legendary Armory';

    case UseInventoryItemCharacterLocation.Inventory:
      return <><Icon icon="user"/> {location.character} (Inventory)</>;
    case UseInventoryItemCharacterLocation.Equipment:
      return <><Icon icon="user"/> {location.character} (Equipped)</>;
    case UseInventoryItemCharacterLocation.EquipmentTemplate:
      return <><Icon icon="user"/> {location.character} (Equipment Template{location.tab && ` "${location.tab}"`})</>;

    default:
      return '?';
  }
};
