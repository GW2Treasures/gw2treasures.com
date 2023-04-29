import { Item } from '@gw2treasures/database';
import { FC } from 'react';
import { Coins } from '../Format/Coins';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { ItemLink } from './ItemLink';
import { ItemTableExpand } from './ItemTableExpand';
import { Rarity } from './Rarity';

export interface ItemTableProps {
  items: Item[]
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

export const ItemTable: FC<ItemTableProps> = ({ items }) => {
  return (
    <Table>
      <thead>
        <tr><th>Item</th><th>Level</th><th>Rarity</th><th>Type</th><th>Vendor Value</th></tr>
      </thead>
      <tbody>
        {items.slice(0, 5).map(renderRow)}
        {items.length > 5 && (
          <ItemTableExpand count={items.length - 5}>
            {items.slice(5).map(renderRow)}
          </ItemTableExpand>
        )}
      </tbody>
    </Table>
  );
};
