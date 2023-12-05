import { Table, type HeaderCellProps } from './Table';
import { type FC, type Key, type ReactElement, type ReactNode } from 'react';
import 'server-only';
import { DataTableClient, DataTableClientCell, DataTableClientColumn, DataTableClientColumnSelection, DataTableClientRows } from './DataTable.client';
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
  sortBy?: ComparableProperties<T> | ((row: T) => Comparable),
  hidden?: boolean,
}

export interface DataTableDynamicColumnsProps<T> {
  children: (row: T, index: number) => ReactNode,
  headers: ReactNode,
}

export interface DataTableColumnSelectionProps {
  children: ReactNode;
}

export function createDataTable<T>(rows: T[], getRowKey: (row: T) => Key): {
  Table: FC<DataTableProps<T>>,
  Column: FC<DataTableColumnProps<T>>,
  DynamicColumns: FC<DataTableDynamicColumnsProps<T>>,
  ColumnSelection: FC<DataTableColumnSelectionProps>,
} {
  const datatableId = crypto.randomUUID();

  const Column: FC<DataTableColumnProps<T>> = () => {
    throw new Error('Only use DataTable.Column inside of DataTable.Table');
  };
  const DynamicColumns: FC<DataTableDynamicColumnsProps<T>> = () => {
    throw new Error('Only use DataTable.DynamicColumns inside of DataTable.Table');
  };

  const ColumnSelection: FC<DataTableColumnSelectionProps> = ({ children }) => {
    return <DataTableClientColumnSelection id={datatableId}>{children}</DataTableClientColumnSelection>;
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
        .filter((column) => isDefinied(column.props.sort) || isDefinied(column.props.sortBy))
        .map((column) => {
          const columnOrder = rowsWithIndex
            .toSorted((a, b) => {
              const sort = column.props.sort ?? sortBy(column.props.sortBy!);

              return sort(a.row, b.row, a.index, b.index);
            })
            .map(({ index }) => index);

          return [column.props.id, columnOrder];
        })
      );

      return (
        <DataTableClient id={datatableId} columns={columns.filter(isStaticColumn).map((column) => ({ id: column.props.id, title: column.props.title, hidden: !!column.props.hidden }))}>
          <Table>
            <thead>
              <tr>
                {columns.map((column) => isStaticColumn(column) ? (
                  <DataTableClientColumn id={column.props.id} key={column.props.id} sortable={!!column.props.sort || !!column.props.sortBy} align={column.props.align} small={column.props.small}>
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
                      <DataTableClientCell key={column.props.id} columnId={column.props.id}>
                        <td align={column.props.align}>{column.props.children(row, index)}</td>
                      </DataTableClientCell>
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
    ColumnSelection,
  };
}

type Comparable = string | number | bigint | null | undefined;

export function compare<T extends Comparable>(a: T, b: T) {
  if(a == null) {
    if(b == null) {
      return 0;
    }
    return -1;
  }
  if(b == null) {
    return 1;
  }

  if(typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }

  if((typeof a === 'number' || typeof a === 'bigint') && (typeof b === 'number' || typeof b === 'bigint')) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  throw new Error(`Cant compare ${typeof a} and ${typeof b}`);
}

type ComparableProperties<T> = {[K in keyof T]: T[K] extends Comparable ? K : never}[keyof T];

export function sortBy<T>(by: ComparableProperties<T> | ((x: T) => Comparable)): (a: T, b: T) => number {
  return typeof by === 'function'
    ? (a, b) => compare(by(a), by(b))
    : (a, b) => compare((a as any)[by], (b as any)[by]);
}
