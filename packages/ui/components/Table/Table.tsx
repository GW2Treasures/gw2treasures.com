import type { FC, ReactNode, ThHTMLAttributes } from 'react';
import styles from './Table.module.css';
import { Icon } from '../../icons';
import { TableWrapper } from './TableWrapper';

export interface TableProps {
  children: ReactNode,
  width?: 'page' | 'auto',
}

export interface HeaderCellProps {
  children?: ReactNode,
  small?: boolean,
  align?: ThHTMLAttributes<HTMLTableCellElement>['align'],
  colSpan?: ThHTMLAttributes<HTMLTableCellElement>['colSpan'],
  width?: number | string,

  sort?: boolean | 'asc' | 'desc',
  onSort?: () => void,
}

const Table: FC<TableProps> & { HeaderCell: FC<HeaderCellProps> } = ({ children, width = 'page' }: TableProps) => (
  <TableWrapper className={styles.wrapper}>
    <table className={width === 'page' ? styles.table : styles.tableAuto}>
      {children}
    </table>
  </TableWrapper>
);

Table.HeaderCell = function HeaderCell({ children, small = false, align, colSpan, width, sort, onSort }: HeaderCellProps) {
  return (
    <th className={small ? styles.small : undefined} align={align} colSpan={colSpan} aria-sort={sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : undefined} style={width ? { width } : undefined}>
      {sort ? (
        <button className={styles.sortButton}
          onClick={onSort}
        >
          {children}
          <Icon icon={sort === 'desc' ? 'sort-desc' : sort === 'asc' ? 'sort-asc' : 'sort'} className={styles.sortIcon}/>
        </button>
      ) : children}
    </th>
  );
};

export {
  Table
};

