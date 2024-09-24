import type { FC, ReactNode } from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: ReactNode
}

export const Badge: FC<BadgeProps> = ({ children }) => (
  <span className={styles.badge}>
    {children}
  </span>
);
