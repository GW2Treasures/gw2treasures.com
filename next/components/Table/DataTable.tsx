import { FC, Key, memo, ReactNode, useCallback, useMemo } from 'react';
import { Table } from './Table';

export interface DataTableColumn<T> {
  key: Key;
  label: ReactNode;
  value: (row: T) => ReactNode;
  small?: boolean;
}

export interface DataTableProps<T> {
  rows: T[];
}

export function useDataTable<T>(columns: DataTableColumn<T>[], rowKey: (row: T) => Key): FC<DataTableProps<T>> {
  return memo(useMemo(() =>
    function DataTable({ rows }) {
      return (
        <Table>
          <thead>
            <tr>
              {columns.map((column) => <th key={column.key} {...(column.small ? { width: 1 } : {})}>{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((column) => <td key={column.key} {...(column.small ? { width: 1 } : {})}>{column.value(row)}</td>)}
              </tr>
            ))}
          </tbody>
        </Table>
      );
    },
    [columns, rowKey]
  ));
}
