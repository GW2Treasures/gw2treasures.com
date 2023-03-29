import { FunctionComponent, ReactNode } from 'react';
import styles from './Table.module.css';

interface TableProps {
  children: ReactNode;
};

const Table: FunctionComponent<TableProps> = ({ children }) => (
  <div className={styles.wrapper}>
    <table className={styles.table}>
      {children}
    </table>
  </div>
);

export {
  Table
};
