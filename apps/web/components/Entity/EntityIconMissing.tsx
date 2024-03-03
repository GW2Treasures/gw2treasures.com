import type { IconSize } from '@/lib/getIconUrl';
import type { FC } from 'react';
import styles from './EntityIcon.module.css';

export interface EntityIconMissingProps {
  size?: IconSize | number;
}

export const EntityIconMissing: FC<EntityIconMissingProps> = ({ size = 64 }) => {
  return (
    <span className={styles.missingIcon} style={{ '--icon-size': `${size}px` }}/>
  );
};
