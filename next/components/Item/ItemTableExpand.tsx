'use client';

import { FC, ReactNode, useState } from 'react';
import styles from './ItemTableExpand.module.css';
import Icon from '../../icons/Icon';

export interface ItemTableExpandProps {
  children: ReactNode;
  count: number;
}

export const ItemTableExpand: FC<ItemTableExpandProps> = ({ children, count }) => {
  const [expanded, setExpanded] = useState(false);

  if(!expanded) {
    return (
      <tr><td colSpan={5}><button className={styles.expandButton} onClick={() => setExpanded(true)}><Icon icon="chevronDown"/> Show {count} more</button></td></tr>
    );
  }

  return <>{children}</>;
};
