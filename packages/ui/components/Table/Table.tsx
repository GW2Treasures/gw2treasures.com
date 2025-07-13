import { type FC, type ReactNode, type ThHTMLAttributes } from 'react';
import styles from './Table.module.css';
import { Icon } from '../../icons';
import { TableWrapper } from './TableWrapper';
import type { RefProp } from '../../lib/react';

export interface TableProps extends RefProp<HTMLTableElement> {
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

const TableComponent: FC<TableProps> = ({ width = 'page', children, ref }) => (
  <TableWrapper className={styles.wrapper}>
    <table className={width === 'page' ? styles.table : styles.tableAuto} ref={ref}>
      {children}
    </table>
  </TableWrapper>
);
TableComponent.displayName = 'Table';

const HeaderCell: FC<HeaderCellProps> = ({ children, small = false, align, colSpan, width, sort, onSort }: HeaderCellProps) => (
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
HeaderCell.displayName = 'Table.HeaderCell';

export const Table = Object.assign(TableComponent, { HeaderCell });

