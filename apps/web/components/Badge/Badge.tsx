import type { CSSProperties, FC, ReactNode } from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: ReactNode,
  color?: CSSProperties['color'],
}

export const Badge: FC<BadgeProps> = ({ children, color }) => (
  <span className={styles.badge} style={color ? { '--badge-color': color } : undefined}>
    {children}
  </span>
);
