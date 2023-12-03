import type { FC, ReactNode } from 'react';
import { TableOfContentAnchor } from '../TableOfContent/TableOfContent';
import styles from './Headline.module.css';

export interface HeadlineProps {
  children: ReactNode;
  id: string;
  noToc?: boolean;
  actions?: ReactNode;
}

export const Headline: FC<HeadlineProps> = ({ children, id, noToc = false, actions }) => {
  return (
    <h2 className={styles.headline}>
      {!noToc && <TableOfContentAnchor id={id}>{children}</TableOfContentAnchor>}
      <span className={styles.content}>
        {children}
      </span>
      {actions && <div className={styles.actions}>{actions}</div>}
    </h2>
  );
};
