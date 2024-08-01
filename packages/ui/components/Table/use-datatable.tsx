import { type FC, Fragment, type Key, memo, type ReactNode, useCallback, useMemo, useState } from 'react';
import { Table } from './Table';
import styles from './Table.module.css';

export interface DataTableColumn<T> {
  key: Key;
  label: ReactNode;
  value: (row: T) => ReactNode;
  small?: boolean;
  sort?: (a: T, b: T) => number;
}

export interface DataTableProps<T> {
  rows: T[];
}

/** @deprecated Use DataTable instead */
export function useDataTable<T>(columns: DataTableColumn<T>[], rowKey: (row: T) => Key, groups?: (row: T) => { value: string, label: ReactNode }): FC<DataTableProps<T>> {
  return memo(useMemo(() =>
    function DataTable({ rows }) {
      const [sortBy, setSortBy] = useState<{column: DataTableColumn<T>, reverse: boolean}>();

      const sortedRows = useMemo(() => (sortBy?.column?.sort !== undefined)
        ? rows.slice().sort((a, b) => sortBy.reverse ? sortBy.column.sort!(a, b) : sortBy.column.sort!(b, a))
        : rows,
        [rows, sortBy]
      );

      const handleSort = useCallback((column: DataTableColumn<T>) => {
        setSortBy((sortBy) => sortBy?.column !== column || !sortBy.reverse
          ? { column, reverse: !sortBy?.reverse && sortBy?.column === column }
          : undefined);
      }, []);

      let lastGroup: string | undefined = undefined;

      return (
        <Table>
          <thead>
            <tr>
              {columns.map((column) => (<ColumnHeader key={column.key} column={column} onSort={handleSort} sortBy={sortBy}/>))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => {
              const group = groups && groups(row);
              const showGroup = sortBy === undefined && group && group.value !== lastGroup;

              if(showGroup) {
                lastGroup = group.value;
              }

              return (
                <Fragment key={rowKey(row)}>
                  {showGroup && (
                    <tr><th colSpan={columns.length} className={styles.group}>{group.label}</th></tr>
                  )}
                  <tr>
                    {columns.map((column) => <td key={column.key} {...(column.small ? { width: 1 } : {})}>{column.value(row)}</td>)}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      );
    },
    [columns, rowKey, groups]
  ));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ColumnHeaderProps<T = any> {
  column: DataTableColumn<T>;
  onSort: (column: DataTableColumn<T>) => void;
  sortBy: { column: DataTableColumn<T>, reverse: boolean } | undefined;
}

const ColumnHeader: FC<ColumnHeaderProps> = ({ column, onSort, sortBy }) => {
  const handleSort = useCallback(() => {
    onSort(column);
  }, [onSort, column]);

  const isActiveSort = sortBy?.column === column;

  return (
    <th {...(column.small ? { width: 1 } : {})} aria-sort={isActiveSort ? (sortBy.reverse ? 'descending' : 'ascending') : undefined}>
      {column.sort ? (
        <button className={isActiveSort ? (sortBy.reverse ? styles.sortDesc : styles.sortAsc) : styles.sort}
          onClick={handleSort}
        >
          {column.label}
        </button>
      ) : (
        column.label
      )}
    </th>
  );
};
