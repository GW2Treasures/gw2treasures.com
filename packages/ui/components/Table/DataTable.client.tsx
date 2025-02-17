'use client';

import { DropDown } from '../DropDown/DropDown';
import { Button } from '../Form/Button';
import { Checkbox } from '../Form/Checkbox';
import { MenuList } from '../Layout/MenuList';
import { Separator } from '../Layout/Separator';
import { DataTableGlobalContext, type AvailableColumn } from './DataTableContext';
import { Table, type HeaderCellProps } from './Table';
import { useState, type FC, type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, type ThHTMLAttributes, type TdHTMLAttributes, use, useDeferredValue, startTransition } from 'react';
import { TableCollapse } from './TableCollapse';
import type { DataTableRowFilterComponent } from './DataTable';
import { compare } from './helper';
import type { Comparable } from './comparable-properties';

type DataTableState = {
  id: string,
  sortBy: string | undefined,
  sortOrder: 'asc' | 'desc',
  visibleColumns: string[],
  interacted: boolean
};
const defaultDataTableContext: DataTableState = {
  id: '',
  sortBy: undefined,
  sortOrder: 'asc',
  visibleColumns: [],
  interacted: false
};

type DataTableContext = {
  state: DataTableState,
  setState: (state: Partial<DataTableState>) => void,

  dynamicValues: Record<string, Comparable[]>
  setDynamicValue: (columnId: string, rowIndex: number, value?: Comparable) => void,
};

const DataTableContext = createContext<DataTableContext>({ state: defaultDataTableContext, setState: () => {}, dynamicValues: {}, setDynamicValue: () => {} });
DataTableContext.displayName = 'DataTableContext';

export interface DataTableClientProps {
  children: ReactNode,
  id: string,
  columns: AvailableColumn[],
  initialSortBy?: string,
  initialSortOrder?: 'asc' | 'desc',
}

function addToArray<T>(array: T[], index: number, value: T): T[] {
  const copy = Array.from(array);
  copy[index] = value;
  return copy;
}

function removeFromArray<T>(array: T[], index: number): T[] {
  const copy = Array.from(array);
  delete copy[index];
  return copy;
}

export const DataTableClient: FC<DataTableClientProps> = ({ children, id, columns, initialSortBy, initialSortOrder = 'asc' }) => {
  const [state, setStateInternal] = useState<DataTableState>({
    ...defaultDataTableContext,
    id,
    visibleColumns: columns.filter((column) => !column.hidden).map(({ id }) => id),
    sortBy: initialSortBy,
    sortOrder: initialSortOrder
  });
  const { currentColumns, currentAvailableColumns } = useCurrentColumns(id);
  const { setAvailableColumns } = useContext(DataTableGlobalContext);

  const setState = useCallback((update: Partial<DataTableState>) => {
    setStateInternal((currentState) => ({ ...currentState, interacted: true, ...update }));
  }, []);

  const [dynamicValues, setDynamicValues] = useState<Record<string, Comparable[]>>({});
  const setDynamicValue = useCallback((columnId: string, rowIndex: number, value?: Comparable) => {
    setDynamicValues((current) => ({ ...current, [columnId]: value ? addToArray(current[columnId] ?? [], rowIndex, value) : removeFromArray(current[columnId] ?? [], rowIndex) }));
  }, []);

  useEffect(() => setAvailableColumns(id, columns), [setAvailableColumns, id, columns]);
  useEffect(() => {
    if(columns === currentAvailableColumns) {
      setState({ visibleColumns: currentColumns, interacted: false });
    }
  }, [currentColumns, columns, currentAvailableColumns, setState]);

  const value = useMemo(
    () => ({ state, setState, dynamicValues, setDynamicValue }),
    [dynamicValues, setDynamicValue, setState, state]
  );

  return (
    <DataTableContext.Provider value={value}>
      {children}
    </DataTableContext.Provider>
  );
};

// === BODY ===
export interface DataTableClientRowsProps {
  children: ReactNode[];
  sortableColumns: Record<string, number[]>
  collapsed: boolean | number;
}

export const DataTableClientRows: FC<DataTableClientRowsProps> = ({ children, sortableColumns, collapsed }) => {
  const { state, dynamicValues } = useContext(DataTableContext);
  const { sortBy, sortOrder, interacted } = state;

  const rows = useMemo(
    () => (sortBy && sortableColumns[sortBy])
      ? sortableColumns[sortBy].map((index) => children.at(index))
      : ((sortBy && dynamicValues[sortBy])
        ? Array.from({ length: children.length }, (_, index) => [index, dynamicValues[sortBy][index]] as const)
          .sort(([, a], [, b]) => compare(a, b))
          .map(([index]) => children.at(index))
        : children),
    [children, dynamicValues, sortBy, sortableColumns]
  );

  const maybeReversed = sortOrder === 'desc' ? rows.toReversed() : rows;

  return collapsed && !interacted
    ? (<TableCollapse limit={collapsed === true ? undefined : collapsed}>{maybeReversed}</TableCollapse>)
    : maybeReversed;
};


// === ROW ===
interface RowContext { index: number }
const RowContext = createContext<RowContext | undefined>(undefined);
RowContext.displayName = 'RowContext';

export interface DataTableClientRowProps {
  children: ReactNode,
  index: number,
  rowFilter?: DataTableRowFilterComponent,
}

export const DataTableClientRow: FC<DataTableClientRowProps> = ({ children, index, rowFilter: RowFilter }) => {
  // create row context value
  const value = useMemo<RowContext>(
    () => ({ index }),
    [index]
  );

  // if the row can be filtered, wrap in RowFilter
  const row = RowFilter
    ? <RowFilter index={index}>{children}</RowFilter>
    : <tr>{children}</tr>;

  return (
    <RowContext value={value}>
      {row}
    </RowContext>
  );
};

// === DYNAMIC COLUMN ===
type ColumnContext = { dynamicColumnId: string };
const ColumnContext = createContext<ColumnContext | undefined>(undefined);
ColumnContext.displayName = 'ColumnContext';

export interface DataTableDynamicClientColumnProps {
  children: ReactNode,
  // TODO: make required
  id?: string,
}

export const DataTableDynamicClientColumn: FC<DataTableDynamicClientColumnProps> = ({ children, id: dynamicColumnId = 'dynamic' }) => {
  const { state: { visibleColumns }} = useContext(DataTableContext);
  const isVisible = visibleColumns.includes(dynamicColumnId);

  // create column context value
  const value = useMemo<ColumnContext>(
    () => ({ dynamicColumnId }),
    [dynamicColumnId]
  );

  if(!isVisible) {
    return null;
  }

  return (
    <ColumnContext value={value}>
      {children}
    </ColumnContext>
  );
};

// === CELL ===
type CellContext = { columnId: string, rowIndex: number };
const CellContext = createContext<CellContext | undefined>(undefined);
CellContext.displayName = 'CellContext';

export interface DataTableClientDynamicCellProps {
  children: ReactNode,
  id: string,
}

export const DataTableClientDynamicCell: FC<DataTableClientDynamicCellProps> = ({ children, id }) => {
  // get row index
  const { index: rowIndex } = use(RowContext)!;

  // get dynamic column prefix
  const { dynamicColumnId } = use(ColumnContext)!;

  // create cell context value
  const value = useMemo<CellContext>(
    () => ({ columnId: `${dynamicColumnId}.${id}`, rowIndex }),
    [dynamicColumnId, id, rowIndex]
  );

  return (
    <CellContext value={value}>
      {children}
    </CellContext>
  );
};


// === SORTABLE CELL ===
export interface SortableDynamicDataTableCellProps {
  children: ReactNode,
  value?: Comparable,
}

export const SortableDynamicDataTableCell: FC<SortableDynamicDataTableCellProps> = ({ children, value }) => {
  const cell = use(CellContext);
  const setDynamicValue = use(DataTableContext).setDynamicValue;

  const deferredValue = useDeferredValue(value);

  useEffect(() => {
    if(cell) {
      setDynamicValue(cell.columnId, cell.rowIndex, deferredValue);
      return () => setDynamicValue(cell.columnId, cell.rowIndex);
    }
  }, [cell, setDynamicValue, deferredValue]);

  return children;
};

// === COLUMN HEADER ===
export interface DataTableClientColumnProps extends Pick<HeaderCellProps, 'align' | 'small' | 'colSpan'> {
  id: string;
  children: ReactNode;
  sortable: boolean;
}

export const DataTableClientColumn: FC<DataTableClientColumnProps> = ({ id, children, sortable, ...props }) => {
  const { state: { sortBy, sortOrder, visibleColumns }, setState } = useContext(DataTableContext);
  const dynamicColumn = use(ColumnContext);

  // check if column is visible
  const isVisible = visibleColumns.includes(dynamicColumn ? dynamicColumn.dynamicColumnId : id);

  // if this is a dynamic column add dynamic column prefix
  const columnId = dynamicColumn ? `${dynamicColumn.dynamicColumnId}.${id}` : id;

  const handleSort = useCallback(() => {
    startTransition(() => {
      setState({
        sortBy: sortBy === columnId && sortOrder === 'desc' ? undefined : columnId,
        sortOrder: sortBy === columnId ? sortOrder === 'asc' ? 'desc' : 'asc' : 'asc'
      });
    });
  }, [columnId, sortOrder, sortBy, setState]);

  if(!isVisible) {
    return null;
  }

  return (
    <Table.HeaderCell sort={sortable ? (sortBy === columnId ? sortOrder : true) : false} onSort={handleSort} {...props}>
      {children}
    </Table.HeaderCell>
  );
};


// === CELL ===
export interface DataTableClientCellProps {
  children: ReactNode;
  columnId: string;
  align: ThHTMLAttributes<HTMLTableCellElement>['align']
}

export const DataTableClientCell: FC<DataTableClientCellProps> = ({ children, columnId, align }) => {
  const { state: { visibleColumns }} = useContext(DataTableContext);
  const isVisible = visibleColumns.includes(columnId);

  return <td hidden={!isVisible} align={align}>{children}</td>;
};


// === COLUMN SELECTION ===
export interface DataTableClientColumnSelectionProps {
  id: string;
  children: ReactNode;
  reset: ReactNode;
}

export const DataTableClientColumnSelection: FC<DataTableClientColumnSelectionProps> = ({ id, children, reset }) => {
  const { columns, setColumns } = useContext(DataTableGlobalContext);
  const { currentAvailableColumns, currentColumns } = useCurrentColumns(id);

  return (
    <DropDown button={<Button icon="columns">{children}</Button>} preferredPlacement="right-start">
      <MenuList>
        {currentAvailableColumns.filter((column) => !column.fixed || column.title).map((column) => (
          <Checkbox key={column.id} checked={column.fixed || currentColumns.includes(column.id)} onChange={(checked) => setColumns(id, currentAvailableColumns.map(({ id }) => id).filter((id) => id === column.id ? checked : currentColumns.includes(id)))} disabled={column.fixed}>{column.title}</Checkbox>
        ))}
        <Separator/>
        <Button appearance="menu" onClick={() => setColumns(id, undefined)} disabled={columns[id] === undefined}>{reset}</Button>
      </MenuList>
    </DropDown>
  );
};

const useCurrentColumns = (id: string) => {
  const { columns, availableColumns } = useContext(DataTableGlobalContext);

  return useMemo(() => {
    const currentAvailableColumns = availableColumns[id] ?? [];
    const defaultColumns = currentAvailableColumns.filter((column) => !column.hidden).map(({ id }) => id);
    const currentColumns = columns[id] ?? defaultColumns;

    return { currentAvailableColumns, defaultColumns, currentColumns };
  }, [availableColumns, columns, id]);
};

// === FOOTER ===
export const DataTableFooterTd: FC<TdHTMLAttributes<HTMLTableCellElement>> = ({ colSpan: requestedColspan, ...props }) => {
  const { state: { visibleColumns }} = useContext(DataTableContext);

  const colSpan = requestedColspan && requestedColspan < 0
    ? visibleColumns.length + requestedColspan
    : requestedColspan;

  return (
    <td colSpan={colSpan} {...props}/>
  );
};
