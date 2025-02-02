'use client';

import { DropDown } from '../DropDown/DropDown';
import { Button } from '../Form/Button';
import { Checkbox } from '../Form/Checkbox';
import { MenuList } from '../Layout/MenuList';
import { Separator } from '../Layout/Separator';
import { DataTableGlobalContext, type AvailableColumn } from './DataTableContext';
import { Table, type HeaderCellProps } from './Table';
import { useState, type FC, type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, type ThHTMLAttributes, type TdHTMLAttributes } from 'react';
import { TableCollapse } from './TableCollapse';

type DataTableContext = { id: string, sortBy: string | undefined, sortOrder: 'asc' | 'desc', visibleColumns: string[], interacted: boolean };
const defaultDataTableContext: DataTableContext = { id: '', sortBy: undefined, sortOrder: 'asc', visibleColumns: [], interacted: false };
const DataTableContext = createContext<{ state: DataTableContext, setState: (state: Partial<DataTableContext>) => void }>({ state: defaultDataTableContext, setState: () => {} });
DataTableContext.displayName = 'DataTableContext';

export interface DataTableClientProps {
  children: ReactNode,
  id: string,
  columns: AvailableColumn[],
  initialSortBy?: string,
  initialSortOrder?: 'asc' | 'desc',
}

export const DataTableClient: FC<DataTableClientProps> = ({ children, id, columns, initialSortBy, initialSortOrder = 'asc' }) => {
  const [state, setStateInternal] = useState<DataTableContext>({
    ...defaultDataTableContext,
    id,
    visibleColumns: columns.filter((column) => !column.hidden).map(({ id }) => id),
    sortBy: initialSortBy,
    sortOrder: initialSortOrder
  });
  const { currentColumns, currentAvailableColumns } = useCurrentColumns(id);
  const { setAvailableColumns } = useContext(DataTableGlobalContext);

  const setState = useCallback((update: Partial<DataTableContext>) => {
    setStateInternal((currentState) => ({ ...currentState, interacted: true, ...update }));
  }, []);

  useEffect(() => setAvailableColumns(id, columns), [setAvailableColumns, id, columns]);
  useEffect(() => {
    if(columns === currentAvailableColumns) {
      setState({ visibleColumns: currentColumns, interacted: false });
    }
  }, [currentColumns, columns, currentAvailableColumns, setState]);

  return (
    <DataTableContext.Provider value={{ state, setState }}>
      {children}
    </DataTableContext.Provider>
  );
};


export interface DataTableClientRowsProps {
  children: ReactNode[];
  sortableColumns: Record<string, number[]>
  collapsed: boolean | number;
}

export const DataTableClientRows: FC<DataTableClientRowsProps> = ({ children, sortableColumns, collapsed }) => {
  const { sortBy, sortOrder, interacted } = useContext(DataTableContext).state;

  const rows = sortBy && sortableColumns[sortBy]
    ? sortOrder === 'desc'
      ? sortableColumns[sortBy].map((index) => children.at(index)).toReversed()
      : sortableColumns[sortBy].map((index) => children.at(index))
    : children;

  return collapsed && !interacted
    ? (<TableCollapse limit={collapsed === true ? undefined : collapsed}>{rows}</TableCollapse>)
    : rows;
};


export interface DataTableClientColumnProps extends Pick<HeaderCellProps, 'align' | 'small'> {
  id: string;
  children: ReactNode;
  sortable: boolean;
}

export const DataTableClientColumn: FC<DataTableClientColumnProps> = ({ id, children, sortable, ...props }) => {
  const { state: { sortBy, sortOrder, visibleColumns }, setState } = useContext(DataTableContext);
  const isVisible = visibleColumns.includes(id);

  const handleSort = useCallback(() => {
    setState({
      sortBy: sortBy === id && sortOrder === 'desc' ? undefined : id,
      sortOrder: sortBy === id ? sortOrder === 'asc' ? 'desc' : 'asc' : 'asc'
    });
  }, [id, sortOrder, sortBy, setState]);

  if(!isVisible) {
    return null;
  }

  return <Table.HeaderCell sort={sortable ? (sortBy === id ? sortOrder : true) : false} onSort={handleSort} {...props}>{children}</Table.HeaderCell>;
};


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
        {currentAvailableColumns.filter((column) => !column.fixed).map((column) => (
          <Checkbox key={column.id} checked={currentColumns.includes(column.id)} onChange={(checked) => setColumns(id, currentAvailableColumns.map(({ id }) => id).filter((id) => id === column.id ? checked : currentColumns.includes(id)))}>{column.title}</Checkbox>
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

export const DataTableFooterTd: FC<TdHTMLAttributes<HTMLTableCellElement>> = ({ colSpan: requestedColspan, ...props }) => {
  const { state: { visibleColumns }} = useContext(DataTableContext);

  const colSpan = requestedColspan && requestedColspan < 0
    ? visibleColumns.length + requestedColspan
    : requestedColspan;

  return (
    <td colSpan={colSpan} {...props}/>
  );
};
