import { FC, ReactNode } from 'react';
import styles from './ItemList.module.css';

export interface ItemListProps {
  children: ReactNode[]
}

export const ItemList: FC<ItemListProps> = ({ children }) => {
  return (
    <ul className={styles.list}>
      {children}
    </ul>
  );
};
