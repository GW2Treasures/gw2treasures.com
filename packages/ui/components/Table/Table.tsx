import { FC, ReactNode, ThHTMLAttributes } from 'react';
import styles from './Table.module.css';

interface TableProps {
  children: ReactNode;
};

interface HeaderCellProps {
  children?: ReactNode;
  small?: boolean;
  align?: ThHTMLAttributes<HTMLTableCellElement>['align'],

  sort?: boolean | 'asc' | 'desc',
  onSort?: () => void;
}

const Table: FC<TableProps> & { HeaderCell: FC<HeaderCellProps> } = ({ children }) => (
  <div className={styles.wrapper}>
    <table className={styles.table}>
      {children}
    </table>
  </div>
);

Table.HeaderCell = function HeaderCell({ children, small = false, align, sort, onSort }) {
  return (
    <th className={small ? styles.small : undefined} align={align} aria-sort={sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : undefined}>
      {sort ? (
        <button className={sort === 'desc' ? styles.sortDesc : sort === 'asc' ? styles.sortAsc : styles.sort}
          onClick={onSort}
        >
          {children}
        </button>
      ) : children}
    </th>
  );
};

export {
  Table
};

