import { createContext, useContext } from 'react';
import type { AvailableColumns } from './types';

export interface Context<ColumnId extends string> {
  availableColumns: AvailableColumns<ColumnId>;
  setAvailableColumns: (availableColumns: AvailableColumns<ColumnId>) => void;
  defaultColumns: ColumnId[];
  setDefaultColumns: (defaultColumns: ColumnId[]) => void;

  selectedColumns: ColumnId[] | undefined;
  setSelectedColumns: (columns: ColumnId[] | undefined) => void;

  id: string;
  isGlobalContext: boolean;
}

export const context = createContext<Context<string>>(undefined!);

export function useItemTableContext<ColumnId extends string>(): Context<ColumnId> {
  return useContext(context) as unknown as Context<ColumnId>;
}
