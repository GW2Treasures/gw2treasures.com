import React, { FC, ReactNode } from 'react';
import { TableOfContentAnchor } from '@gw2treasures/ui';
import styles from './Headline.module.css';

export interface HeadlineProps {
  children: ReactNode;
  id: string;
  noToc?: boolean;
  actions?: ReactNode;
}

export const Headline: FC<HeadlineProps> = ({ children, id, noToc = false, actions }) => {
  return (
    <header role="heading" className={styles.headline} aria-level={2}>
      {!noToc && <TableOfContentAnchor id={id}>{children}</TableOfContentAnchor>}
      <span className={styles.content}>
        {children}
      </span>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
};
