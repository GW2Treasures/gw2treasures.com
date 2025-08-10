import type { CSSProperties, FC, ReactNode } from 'react';
import styles from './ItemList.module.css';
import { cx } from '@gw2treasures/ui';

export interface ItemListProps {
  children: ReactNode[],
  singleColumn?: boolean,
  style?: CSSProperties,
}

export const ItemList: FC<ItemListProps> = ({ children, singleColumn, style }) => {
  return (
    <ul className={cx(styles.list, singleColumn && styles.singleColumn)} style={style}>
      {children}
    </ul>
  );
};
