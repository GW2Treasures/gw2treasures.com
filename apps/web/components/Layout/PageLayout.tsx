import { type FC, type ReactNode } from 'react';
import { TableOfContent, TableOfContentContext } from '@gw2treasures/ui/components/TableOfContent/TableOfContent';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: ReactNode;
  toc?: boolean;
}

export const PageLayout: FC<PageLayoutProps> = ({ children, toc = false }) => {

  return toc ? (
    <TableOfContentContext>
      <main className={styles.page}>
        <aside className={styles.tableOfContent}>
          <TableOfContent/>
        </aside>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </TableOfContentContext>
  ) : (
    <main className={styles.page}>
      <div className={styles.content}>
        {children}
      </div>
    </main>
  );
};
