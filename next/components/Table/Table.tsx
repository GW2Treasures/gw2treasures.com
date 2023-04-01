import { FC, FunctionComponent, ReactNode } from 'react';
import styles from './Table.module.css';

interface TableProps {
  children: ReactNode;
};

interface HeaderCellProps {
  children?: ReactNode;
  small?: boolean;
}

const Table: FC<TableProps> & { HeaderCell: FC<HeaderCellProps> } = ({ children }) => (
  <div className={styles.wrapper}>
    <table className={styles.table}>
      {children}
    </table>
  </div>
);

Table.HeaderCell = function HeaderCell({ children, small = false }) {
  return (<th className={small ? styles.small : undefined}>{children}</th>);
};

export {
  Table
};

