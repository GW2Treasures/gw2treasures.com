import { Table, type HeaderCellProps } from './Table';
import { type FC, type Key, type ReactElement, type ReactNode } from 'react';
import 'server-only';
import { DataTableClient, DataTableClientColumn, DataTableClientRows } from './DataTable.client';


// table
export interface DataTableProps<T> {
  children: Array<ColumnReactElement<T>>
}

type ColumnReactElement<T> = ReactElement<DataTableColumnProps<T>, FC<DataTableColumnProps<T>>>;

export interface DataTableColumnProps<T> extends Pick<HeaderCellProps, 'align' | 'small'> {
  id: string,
  children: ReactNode,
  render: ((row: T, index: number) => ReactNode),
  sort?: (a: T, b: T, aIndex: number, bIndex: number) => number,
}

export function createDataTable<T>(rows: T[], getRowKey: (row: T) => Key): { Table: FC<DataTableProps<T>>, Column: FC<DataTableColumnProps<T>> } {
  return {
    Table: function DataTable({ children }: DataTableProps<T>) {
      const columns = children;
      const rowsWithIndex = rows.map((row, index) => ({ row, index }));

      const sortableColumns = Object.fromEntries(children
        .filter((column) => column.props.sort)
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
                {columns.map((column) => (
                  <DataTableClientColumn id={column.props.id} key={column.props.id} sortable={!!column.props.sort} align={column.props.align} small={column.props.small}>
                    {column.props.children}
                  </DataTableClientColumn>
                ))}
              </tr>
            </thead>
            <tbody>
              <DataTableClientRows sortableColumns={sortableColumns}>
                {rows.map((row, index) => (
                  <tr key={getRowKey(row)}>
                    {columns.map((column) => <td key={column.props.id} align={column.props.align}>{column.props.render(row, index)}</td>)}
                  </tr>
                ))}
              </DataTableClientRows>
            </tbody>
          </Table>
        </DataTableClient>
      );
    },
    Column: () => {
      throw new Error('Only use DataTable.Column inside of DataTable.Table');
    }
  };
}

