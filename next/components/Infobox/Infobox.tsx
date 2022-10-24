import { FC, ReactNode } from 'react';
import styles from './Infobox.module.css';

export interface InfoboxProps {
  children: ReactNode;
}

export const Infobox: FC<InfoboxProps> = ({ children }) => {
  return <div className={styles.infobox}>{children}</div>;
};
