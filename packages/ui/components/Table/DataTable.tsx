import { Table, type HeaderCellProps } from './Table';
import { type FC, type Key, type ReactElement, type ReactNode } from 'react';
import 'server-only';
import { DataTableClient, DataTableClientCell, DataTableClientColumn, DataTableClientColumnSelection, DataTableClientRow, DataTableClientRows, DataTableDynamicClientColumn } from './DataTable.client';
import { isDefined, isTruthy } from '@gw2treasures/helper/is';
import type { Comparable, ComparableProperties } from './comparable-properties';
import { sortBy } from './helper';

export type DataTableRowFilterComponentProps = { children: ReactNode, index: number };
export type DataTableRowFilterComponent = FC<DataTableRowFilterComponentProps>;

// table
export interface DataTableProps<T> {
  children: Array<ColumnReactElement<T> | DynamicColumnsReactElement<T> | FooterReactElement | false>,
  rowFilter?: DataTableRowFilterComponent,
  collapsed?: boolean | number,
  initialSortBy?: string,
  initialSortOrder?: 'asc' | 'desc',
}

type ColumnReactElement<T> = ReactElement<DataTableColumnProps<T>, FC<DataTableColumnProps<T>>>;
type DynamicColumnsReactElement<T> = ReactElement<DataTableDynamicColumnsProps<T>, FC<DataTableDynamicColumnsProps<T>>>;
type FooterReactElement = ReactElement<{ children: ReactNode }, FC<{ children: ReactNode }>>;

export interface DataTableColumnProps<T> extends Pick<HeaderCellProps, 'align' | 'small' | 'colSpan'> {
  id: string,
  title: ReactNode,
  children: ((row: T, index: number) => ReactNode),
  sort?: (a: T, b: T, aIndex: number, bIndex: number) => number,
  sortBy?: ComparableProperties<T> | ((row: T) => Comparable),
  hidden?: boolean,
  fixed?: boolean,
  colSpan?: number,
  width?: number | string,
}

export interface DataTableDynamicColumnsProps<T> {
  id: string,
  title: ReactNode,
  children: (row: T, index: number) => ReactNode,
  headers: ReactNode,
  hidden?: boolean,
  fixed?: boolean,
}

export interface DataTableColumnSelectionProps {
  children: ReactNode,
  reset: ReactNode,
}

export interface DataTableFooterProps {
  children: ReactNode,
}

export type DataTable<T> = {
  Table: FC<DataTableProps<T>>,
  Column: FC<DataTableColumnProps<T>>,
  DynamicColumns: FC<DataTableDynamicColumnsProps<T>>,
  ColumnSelection: FC<DataTableColumnSelectionProps>,
  Footer: FC<DataTableFooterProps>,
};

export function createDataTable<T>(rows: T[], getRowKey: (row: T, index: number) => Key): DataTable<T> {
  const datatableId = crypto.randomUUID();

  const Column: FC<DataTableColumnProps<T>> = () => {
    throw new Error('Only use DataTable.Column inside of DataTable.Table');
  };
  const DynamicColumns: FC<DataTableDynamicColumnsProps<T>> = () => {
    throw new Error('Only use DataTable.DynamicColumns inside of DataTable.Table');
  };

  const ColumnSelection: FC<DataTableColumnSelectionProps> = ({ children, reset }) => {
    return <DataTableClientColumnSelection id={datatableId} reset={reset}>{children}</DataTableClientColumnSelection>;
  };

  const Footer: FC<DataTableFooterProps> = ({ children }) => {
    return <tr>{children}</tr>;
  };

  function isStaticColumn(child: ReactElement): child is ColumnReactElement<T> {
    return child.type === Column;
  }

  return {
    Table: function DataTable({ children, rowFilter, collapsed = false, ...props }: DataTableProps<T>) {
      const columnsOrFooter = children.filter(isTruthy);

      const footer = columnsOrFooter.filter(({ type }) => type === Footer);
      const columns = columnsOrFooter.filter((c) => !footer.includes(c)) as Array<ColumnReactElement<T> | DynamicColumnsReactElement<T>>;

      if(columns.some((child) => child.type !== Column && child.type !== DynamicColumns)) {
        throw new Error('Column and DynamicColumns are the only allowed children of DataTable');
      }

      const rowsWithIndex = rows.map((row, index) => ({ row, index }));

      const sortableColumns = Object.fromEntries(columns
        .filter(isStaticColumn)
        .filter((column) => isDefined(column.props.sort) || isDefined(column.props.sortBy))
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
        <DataTableClient id={datatableId} columns={columns.map((column) => ({ id: column.props.id, title: <>{column.props.title}</>, hidden: !!column.props.hidden, fixed: !!column.props.fixed }))} {...props}>
          <Table>
            <thead>
              <tr>
                {columns.map((column) => isStaticColumn(column) ? (
                  <DataTableClientColumn key={column.props.id} id={column.props.id} sortable={!!column.props.sort || !!column.props.sortBy} align={column.props.align} small={column.props.small} colSpan={column.props.colSpan} width={column.props.width}>
                    {column.props.title}
                  </DataTableClientColumn>
                ) : (
                  <DataTableDynamicClientColumn key={column.props.id} id={column.props.id}>
                    {column.props.headers}
                  </DataTableDynamicClientColumn>
                ))}
              </tr>
            </thead>
            <tbody>
              <DataTableClientRows sortableColumns={sortableColumns} collapsed={collapsed}>
                {rows.map((row, index) => {
                  return (
                    <DataTableClientRow key={getRowKey(row, index)} index={index} rowFilter={rowFilter}>
                      {columns.map((column) => isStaticColumn(column) ? (
                        <DataTableClientCell key={column.props.id} columnId={column.props.id} align={column.props.align} colSpan={!!column.props.colSpan}>
                          {column.props.children(row, index)}
                        </DataTableClientCell>
                      ) : (
                        <DataTableDynamicClientColumn key={column.props.id ?? column.key} id={column.props.id}>
                          {column.props.children(row, index)}
                        </DataTableDynamicClientColumn>
                      ))}
                    </DataTableClientRow>
                  );
                })}
              </DataTableClientRows>
            </tbody>
            {footer.length > 0 && <tfoot>{footer}</tfoot>}
          </Table>
        </DataTableClient>
      );
    },
    Column,
    DynamicColumns,
    ColumnSelection,
    Footer,
  };
}
