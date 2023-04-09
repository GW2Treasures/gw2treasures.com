import { FC, ReactNode } from 'react';
import styles from './MenuList.module.css';

export interface MenuListProps {
  children: ReactNode;
}

export const MenuList: FC<MenuListProps> = ({ children }) => {
  return <div className={styles.menuList}>{children}</div>;
};
