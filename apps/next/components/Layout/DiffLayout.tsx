import { cloneElement, FC, ReactElement, ReactNode } from 'react';
import { cx } from '../../lib/classNames';
import styles from './DiffLayout.module.css';

export interface DiffLayoutProps {
  children: ReactNode;
};

export const DiffLayout: FC<DiffLayoutProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

interface DiffLayoutHeaderProps {
  icons: [ a: ReactElement | undefined, b: ReactElement | undefined ],
  title: [ a: ReactNode, b: ReactNode ],
  subtitle: [ a: ReactNode, b: ReactNode ],
};

export const DiffLayoutHeader: FC<DiffLayoutHeaderProps> = ({ icons, title, subtitle }) => {
  return (
    <div className={styles.diffHeader}>
      <div className={cx(styles.left, styles.header)}>
        {icons[0]}
        <div className={styles.title}>{title[0]}</div>
        <div className={styles.breadcrumb}>{subtitle[0]}</div>
      </div>
      <div className={cx(styles.right, styles.header)}>
        {icons[1]}
        <div className={styles.title}>{title[1]}</div>
        <div className={styles.breadcrumb}>{subtitle[1]}</div>
      </div>
    </div>
  );
};


interface DiffLayoutRowProps {
  left: ReactNode;
  right: ReactNode;
  changed?: boolean;
};

export const DiffLayoutRow: FC<DiffLayoutRowProps> = ({ left, right, changed = false }) => {
  return (
    <div className={cx(styles.diffRow, !left && styles.added, !right && styles.removed, left && right && changed && styles.changed)}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </div>
  );
};
