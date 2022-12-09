import { FC, ReactNode } from 'react';
import { TableOfContent, TableOfContentContext } from '../TableOfContent/TableOfContent';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: ReactNode;
  toc?: boolean;
};

export const PageLayout: FC<PageLayoutProps> = ({ children, toc = false }) => {

  return (
    <TableOfContentContext>
      <main className={styles.page}>
        {toc && (
          <aside className={styles.tableOfContent}>
            <TableOfContent/>
          </aside>
        )}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </TableOfContentContext>
  );
};
