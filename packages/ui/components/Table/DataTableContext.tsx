'use client';

import { createContext, useState, type FC, type ReactNode, useCallback } from 'react';

type DataTableGlobalContext = {
  columns: Record<string, string[] | undefined>,
  setColumns: (id: string, columns: string[] | undefined) => void,

  availableColumns: Record<string, AvailableColumn[] | undefined>,
  setAvailableColumns: (id: string, columns: AvailableColumn[]) => void,
};

export const DataTableGlobalContext = createContext<DataTableGlobalContext>({
  columns: {},
  setColumns: () => {},
  availableColumns: {},
  setAvailableColumns: () => {}
});

export interface DataTableContextProps {
  children: ReactNode;
}

export type AvailableColumn = { id: string, title: ReactNode, hidden: boolean, fixed: boolean };

export const DataTableContext: FC<DataTableContextProps> = ({ children }) => {
  const [availableColumns, setAvailableColumnsInternal] = useState<Record<string, AvailableColumn[]>>({});
  const [columns, setColumnsInternal] = useState<Record<string, string[] | undefined>>({});

  const setColumns = useCallback((id: string, columns: string[] | undefined) => {
    setColumnsInternal((globalColumns) => ({ ...globalColumns, [id]: columns }));
  }, []);

  const setAvailableColumns = useCallback((id: string, columns: AvailableColumn[]) => {
    setAvailableColumnsInternal((globalColumns) => ({ ...globalColumns, [id]: columns }));
  }, []);


  return (
    <DataTableGlobalContext.Provider value={{ columns, setColumns, availableColumns, setAvailableColumns }}>
      {children}
    </DataTableGlobalContext.Provider>
  );
};
