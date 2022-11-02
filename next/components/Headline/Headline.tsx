import React, { FC, ReactNode } from 'react';
import { TableOfContentAnchor } from '../TableOfContent/TableOfContent';
import styles from './Headline.module.css';

export interface HeadlineProps {
  children: ReactNode;
  id: string;
  noToc?: boolean;
}

export const Headline: FC<HeadlineProps> = ({ children, id, noToc = false }) => {
  return (
    <header role="heading" className={styles.headline}>
      {!noToc && <TableOfContentAnchor id={id}>{children}</TableOfContentAnchor>}
      {children}
    </header>
  );
};
