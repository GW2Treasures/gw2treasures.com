import { Item } from '@gw2treasures/database';
import { FC } from 'react';
import { Coins } from '../Format/Coins';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { ItemLink } from './ItemLink';
import { Rarity } from './Rarity';
import { TableCollapse } from '@gw2treasures/ui/components/Table/TableCollapse';

export interface ItemTableProps {
  items: Item[];
  limit?: number;
}

function renderRow(item: Item) {
  return (
    <tr key={item.id}>
      <th><ItemLink item={item}/></th>
      <td>{item.level}</td>
      <td><Rarity rarity={item.rarity}/></td>
      <td>{item.type} {item.subtype && `(${item.subtype})`}</td>
      <td><Coins value={item.value}/></td>
    </tr>
  );
}

export const ItemTable: FC<ItemTableProps> = ({ items, limit = 5 }) => {
  return (
    <Table>
      <thead>
        <tr><th>Item</th><th>Level</th><th>Rarity</th><th>Type</th><th>Vendor Value</th></tr>
      </thead>
      <tbody>
        <TableCollapse limit={limit}>
          {items.map(renderRow)}
        </TableCollapse>
      </tbody>
    </Table>
  );
};
