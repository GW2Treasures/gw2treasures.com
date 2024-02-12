'use client';

import { DropDown } from '../DropDown/DropDown';
import { Button } from '../Form/Button';
import { Checkbox } from '../Form/Checkbox';
import { MenuList } from '../Layout/MenuList';
import { Separator } from '../Layout/Separator';
import { DataTableGlobalContext, type AvailableColumn } from './DataTableContext';
import { Table, type HeaderCellProps } from './Table';
import { useState, type FC, type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, type ThHTMLAttributes } from 'react';

type DataTableContext = { id: string, sortBy: string | undefined, sortOrder: 'asc' | 'desc', visibleColumns: string[] };
const defaultDataTableContext: DataTableContext = { id: '', sortBy: undefined, sortOrder: 'asc', visibleColumns: [] };
const DataTableContext = createContext<{ state: DataTableContext, setState: (state: Partial<DataTableContext>) => void}>({ state: defaultDataTableContext, setState: () => {} });
DataTableContext.displayName = 'DataTableContext';

export interface DataTableClientProps {
  children: ReactNode;
  id: string;
  columns: AvailableColumn[]
}

export const DataTableClient: FC<DataTableClientProps> = ({ children, id, columns }) => {
  const [state, setStateInternal] = useState({ ...defaultDataTableContext, id, visibleColumns: columns.filter((column) => !column.hidden).map(({ id }) => id) });
  const { currentColumns, currentAvailableColumns } = useCurrentColumns(id);
  const { setAvailableColumns } = useContext(DataTableGlobalContext);

  const setState = useCallback((update: Partial<DataTableContext>) => {
    setStateInternal((currentState) => ({ ...currentState, ...update }));
  }, []);

  useEffect(() => setAvailableColumns(id, columns), [setAvailableColumns, id, columns]);
  useEffect(() => {
    if(columns === currentAvailableColumns) {
      setStateInternal((state) => ({ ...state, visibleColumns: currentColumns }));
    }
  }, [currentColumns, columns, currentAvailableColumns]);

  return (
    <DataTableContext.Provider value={{ state, setState }}>
      {children}
    </DataTableContext.Provider>
  );
};


export interface DataTableClientRowsProps {
  children: ReactNode[];
  sortableColumns: Record<string, number[]>
}

export const DataTableClientRows: FC<DataTableClientRowsProps> = ({ children, sortableColumns }) => {
  const { sortBy, sortOrder } = useContext(DataTableContext).state;

  if(sortBy && sortableColumns[sortBy]) {
    const sortedChildren = sortableColumns[sortBy].map((index) => children[index]);

    if(sortOrder === 'desc') {
      return sortedChildren.reverse();
    }
    return sortedChildren;
  }

  return children;
};


export interface DataTableClientColumnProps extends Pick<HeaderCellProps, 'align' | 'small'> {
  id: string;
  children: ReactNode;
  sortable: boolean;
  hidden?: boolean;
}

export const DataTableClientColumn: FC<DataTableClientColumnProps> = ({ id, children, sortable, hidden = false, ...props }) => {
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
        {currentAvailableColumns.map((column) => (
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
