import React, { FC, ReactNode } from 'react';
import { TableOfContentAnchor } from '../TableOfContent/TableOfContent';
import styles from './Headline.module.css';

export interface HeadlineProps {
  children: ReactNode;
  id: string;
}

export const Headline: FC<HeadlineProps> = ({ children, id }) => {
  return (
    <header role="heading" className={styles.headline}>
      <TableOfContentAnchor id={id}>{children}</TableOfContentAnchor>
      {children}
    </header>
  );
};
