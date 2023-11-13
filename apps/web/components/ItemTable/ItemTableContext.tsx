'use client';

import { type FC, type ReactNode, useEffect, useMemo, useState } from 'react';
import { context } from './context';
import type { AvailableColumns, GlobalColumnId } from './types';

interface ItemTableContextProps {
  children: ReactNode;
  id: string;
  global?: boolean;
};

const emptyAvailableColumns = {} as AvailableColumns<any>;

export const ItemTableContext: FC<ItemTableContextProps> = ({ children, id, global: isGlobalContext = false }) => {
  const [availableColumns, setAvailableColumns] = useState<AvailableColumns<any>>(emptyAvailableColumns);
  const [defaultColumns, setDefaultColumns] = useState<GlobalColumnId[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<GlobalColumnId[]>();

  // store selected columns in localStorage if this is not the global context and available columns are set
  const localStorageKey = !isGlobalContext && availableColumns !== emptyAvailableColumns
    ? `gw2t.itemTable.columns.${id}`
    : undefined;

  // load selected columns from localStorage
  useEffect(() => {
    if(!localStorageKey) {
      return;
    }

    try {
      const columns = JSON.parse(localStorage.getItem(localStorageKey) ?? 'false');

      if(Array.isArray(columns) && columns.every((column) => column in availableColumns)) {
        setSelectedColumns(columns);
      }
    } catch {}
  }, [availableColumns, localStorageKey]);

  // store selected columns in localStorage
  useEffect(() => {
    if(!localStorageKey) {
      return;
    }

    if(selectedColumns) {
      localStorage.setItem(localStorageKey, JSON.stringify(selectedColumns));
    } else {
      localStorage.removeItem(localStorageKey);
    }
  }, [localStorageKey, selectedColumns]);

  const value = useMemo(() => ({
    availableColumns, setAvailableColumns,
    defaultColumns, setDefaultColumns,
    selectedColumns, setSelectedColumns,
    isGlobalContext,
  }), [availableColumns, defaultColumns, selectedColumns, isGlobalContext]);

  return (
    <context.Provider value={value}>{children}</context.Provider>
  );
};
