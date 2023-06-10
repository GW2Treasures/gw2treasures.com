import { Item } from '@gw2treasures/database';
import { FC } from 'react';
import { Coins } from '../Format/Coins';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { ItemLink } from './ItemLink';
import { ItemTableExpand } from './ItemTableExpand';
import { Rarity } from './Rarity';

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
        {items.slice(0, limit).map(renderRow)}
        {items.length > limit && (
          <ItemTableExpand count={items.length - limit}>
            {items.slice(limit).map(renderRow)}
          </ItemTableExpand>
        )}
      </tbody>
    </Table>
  );
};
