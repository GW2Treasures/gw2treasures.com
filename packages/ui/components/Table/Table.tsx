import { FC, ReactNode, ThHTMLAttributes } from 'react';
import styles from './Table.module.css';

interface TableProps {
  children: ReactNode;
};

interface HeaderCellProps {
  children?: ReactNode;
  small?: boolean;
  align?: ThHTMLAttributes<HTMLTableCellElement>['align']
}

const Table: FC<TableProps> & { HeaderCell: FC<HeaderCellProps> } = ({ children }) => (
  <div className={styles.wrapper}>
    <table className={styles.table}>
      {children}
    </table>
  </div>
);

Table.HeaderCell = function HeaderCell({ children, small = false, align }) {
  return (<th className={small ? styles.small : undefined} align={align}>{children}</th>);
};

export {
  Table
};

