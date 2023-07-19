import { createContext, useContext } from 'react';
import { ItemTableProps } from './ItemTable.client';
import { DefaultColumnName } from './columns';

export interface Context {
  availableColumns: ItemTableProps['availableColumns'];
  setAvailableColumns: (availableColumns: ItemTableProps['availableColumns']) => void;
  defaultColumns: DefaultColumnName[];
  setDefaultColumns: (defaultColumns: DefaultColumnName[]) => void;

  selectedColumns: DefaultColumnName[] | undefined;
  setSelectedColumns: (columns: DefaultColumnName[] | undefined) => void;

  isGlobalContext: boolean;
}

export const context = createContext<Context>(undefined!);

export function useItemTableContext() {
  return useContext(context);
}
