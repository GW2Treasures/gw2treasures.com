'use client';

import { Table, type HeaderCellProps } from './Table';
import { useState, type FC, type ReactNode, createContext, useCallback, useContext } from 'react';

type DataTableContext = { sortBy: string | undefined, sortOrder: 'asc' | 'desc' };
const defaultDataTableContext: DataTableContext = { sortBy: undefined, sortOrder: 'asc' };
const DataTableContext = createContext<{ state: DataTableContext, setState: (state: DataTableContext) => void}>({ state: defaultDataTableContext, setState: () => {} });
DataTableContext.displayName = 'DataTableContext';

export interface DataTableClientProps {
  children: ReactNode;
}

export const DataTableClient: FC<DataTableClientProps> = ({ children }) => {
  const [state, setState] = useState(defaultDataTableContext);

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
}

export const DataTableClientColumn: FC<DataTableClientColumnProps> = ({ id, children, sortable, ...props }) => {
  const { state: { sortBy, sortOrder }, setState } = useContext(DataTableContext);

  const handleSort = useCallback(() => {
    setState({
      sortBy: sortBy === id && sortOrder === 'desc' ? undefined : id,
      sortOrder: sortBy === id ? sortOrder === 'asc' ? 'desc' : 'asc' : 'asc'
    });
  }, [id, sortOrder, sortBy, setState]);

  return <Table.HeaderCell sort={sortable ? (sortBy === id ? sortOrder : true) : false} onSort={handleSort} {...props}>{children}</Table.HeaderCell>;
};
