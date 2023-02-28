'use client';

import { Item } from '@prisma/client';
import { FC, useState } from 'react';
import { Coins } from '../Format/Coins';
import { Table } from '../Table/Table';
import { ItemLink } from './ItemLink';
import { Rarity } from './Rarity';
import styles from './ItemTable.module.css';
import Icon from '../../icons/Icon';

export interface ItemTableProps {
  items: Item[]
}

export const ItemTable: FC<ItemTableProps> = ({ items }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Table>
      <thead>
        <tr><th>Item</th><th>Level</th><th>Rarity</th><th>Type</th><th>Vendor Value</th></tr>
      </thead>
      <tbody>
        {items.filter((_, index) => expanded || index < 5).map((item) => (
          <tr key={item.id}>
            <th><ItemLink item={item}/></th>
            <td>{item.level}</td>
            <td><Rarity rarity={item.rarity}/></td>
            <td>{item.type} {item.subtype && `(${item.subtype})`}</td>
            <td><Coins value={item.value}/></td>
          </tr>
        ))}
        {!expanded && items.length > 5 && <tr><td colSpan={5}><button className={styles.expandButton} onClick={() => setExpanded(true)}><Icon icon="chevronDown"/> Show {items.length - 5} more</button></td></tr>}
      </tbody>
    </Table>
  );
};
