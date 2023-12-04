import { Table, type HeaderCellProps } from './Table';
import { type FC, type Key, type ReactElement, type ReactNode } from 'react';
import 'server-only';
import { DataTableClient, DataTableClientColumn, DataTableClientRows } from './DataTable.client';
import { isDefinied } from '../../lib';


// table
export interface DataTableProps<T> {
  children: Array<ColumnReactElement<T> | DynamicColumnsReactElement<T>>
}

type ColumnReactElement<T> = ReactElement<DataTableColumnProps<T>, FC<DataTableColumnProps<T>>>;
type DynamicColumnsReactElement<T> = ReactElement<DataTableDynamicColumnsProps<T>, FC<DataTableDynamicColumnsProps<T>>>;

export interface DataTableColumnProps<T> extends Pick<HeaderCellProps, 'align' | 'small'> {
  id: string,
  title: ReactNode,
  children: ((row: T, index: number) => ReactNode),
  sort?: (a: T, b: T, aIndex: number, bIndex: number) => number,
}

export interface DataTableDynamicColumnsProps<T> {
  children: (row: T, index: number) => ReactNode,
  headers: ReactNode,
}

export function createDataTable<T>(rows: T[], getRowKey: (row: T) => Key): {
  Table: FC<DataTableProps<T>>,
  Column: FC<DataTableColumnProps<T>>,
  DynamicColumns: FC<DataTableDynamicColumnsProps<T>>,
} {
  const Column: FC<DataTableColumnProps<T>> = () => {
    throw new Error('Only use DataTable.Column inside of DataTable.Table');
  };
  const DynamicColumns: FC<DataTableDynamicColumnsProps<T>> = () => {
    throw new Error('Only use DataTable.DynamicColumns inside of DataTable.Table');
  };

  function isStaticColumn(child: ReactElement): child is ColumnReactElement<T> {
    return child.type === Column;
  }

  return {
    Table: function DataTable({ children }: DataTableProps<T>) {
      const columns = children;

      if(columns.some((child) => child.type !== Column && child.type !== DynamicColumns)) {
        throw new Error('Column and DynamicColumns are the only allowed children of DataTable');
      }

      const rowsWithIndex = rows.map((row, index) => ({ row, index }));

      const sortableColumns = Object.fromEntries(children
        .filter(isStaticColumn)
        .filter((column) => isDefinied(column.props.sort))
        .map((column) => {
          const columnOrder = rowsWithIndex
            .toSorted((a, b) => column.props.sort!(a.row, b.row, a.index, b.index))
            .map(({ index }) => index);

          return [column.props.id, columnOrder];
        })
      );

      return (
        <DataTableClient>
          <Table>
            <thead>
              <tr>
                {columns.map((column) => isStaticColumn(column) ? (
                  <DataTableClientColumn id={column.props.id} key={column.props.id} sortable={!!column.props.sort} align={column.props.align} small={column.props.small}>
                    {column.props.title}
                  </DataTableClientColumn>
                ) : (
                  column.props.headers
                ))}
              </tr>
            </thead>
            <tbody>
              <DataTableClientRows sortableColumns={sortableColumns}>
                {rows.map((row, index) => (
                  <tr key={getRowKey(row)}>
                    {columns.map((column) => isStaticColumn(column) ? (
                      <td key={column.props.id} align={column.props.align}>{column.props.children(row, index)}</td>
                    ) : column.props.children(row, index))}
                  </tr>
                ))}
              </DataTableClientRows>
            </tbody>
          </Table>
        </DataTableClient>
      );
    },
    Column,
    DynamicColumns,
  };
}

