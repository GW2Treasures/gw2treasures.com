'use client';

import type { FC, ReactNode } from 'react';
import { useTableOfContentAnchor } from '../TableOfContent/TableOfContent';
import styles from './Headline.module.css';

export interface HeadlineProps {
  children: ReactNode,
  tableOfContentLabel?: ReactNode,
  id: string,
  noToc?: boolean,
  actions?: ReactNode,
}

export const Headline: FC<HeadlineProps> = ({ children, tableOfContentLabel, id, noToc = false, actions }) => {
  const ref = useTableOfContentAnchor(id, { label: tableOfContentLabel ?? children, enabled: !noToc });

  return (
    <h2 className={styles.headline} ref={ref} id={id}>
      <span className={styles.content}>
        {children}
      </span>
      {actions && <div className={styles.actions}>{actions}</div>}
    </h2>
  );
};
