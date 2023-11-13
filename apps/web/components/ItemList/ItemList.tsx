import { type FC, type ReactNode } from 'react';
import styles from './ItemList.module.css';
import { cx } from '@gw2treasures/ui';

export interface ItemListProps {
  children: ReactNode[];
  singleColumn?: boolean;
}

export const ItemList: FC<ItemListProps> = ({ children, singleColumn }) => {
  return (
    <ul className={cx(styles.list, singleColumn && styles.singleColumn)}>
      {children}
    </ul>
  );
};
