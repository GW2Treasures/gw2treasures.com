import { FC, ReactNode } from 'react';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: ReactNode;
};

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {

  return (
    <div className={styles.page}>
      {children}
    </div>
  );
};
