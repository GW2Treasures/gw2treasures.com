'use client';

import { FC, ReactNode, useMemo, useState } from 'react';
import { context } from './context';
import { ItemTableProps } from './ItemTable.client';
import { DefaultColumnName } from './columns';

interface ItemTableContextProps {
  children: ReactNode;
  global?: boolean;
};

export const ItemTableContext: FC<ItemTableContextProps> = ({ children, global: isGlobalContext = false }) => {
  const [availableColumns, setAvailableColumns] = useState<ItemTableProps['availableColumns']>({} as any);
  const [defaultColumns, setDefaultColumns] = useState<DefaultColumnName[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<DefaultColumnName[]>();

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
