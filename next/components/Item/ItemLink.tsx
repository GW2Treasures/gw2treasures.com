import Link from 'next/link';
import React, { FC } from 'react';
import { Item } from '../../.prisma/database';
import { ItemIcon } from './ItemIcon';
import styles from './ItemLink.module.css';

export interface ItemLinkProps {
  item: Item;
  icon?: 16 | 32 | 64 | 'none';
}

export const ItemLink: FC<ItemLinkProps> = ({ item, icon = 32 }) => {
  return (
    <Link href={`/item/${item.id}`}>
      <a className={styles.link}>
        {/* {icon !== 'none' && <ItemIcon item={item} size={icon}/>} */}
        <span className={styles.name}>{item.name_en}</span>
      </a>
    </Link>
  );
};
