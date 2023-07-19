import 'server-only';

import { FC } from 'react';
import { ItemTable as ClientComponent } from './ItemTable.client';
import { DefaultColumnName } from './columns';
import { ItemTableQuery, Signed } from './query';
import { ErrorBoundary } from 'react-error-boundary';
import { Notice } from '../Notice/Notice';

interface ItemTableProps {
  query: Signed<ItemTableQuery>;
  defaultColumns?: DefaultColumnName[];
  collapsed?: boolean;
};

export const ItemTable: FC<ItemTableProps> = ({ query, defaultColumns, collapsed }) => {

  return (
    <ErrorBoundary fallback={<Notice type="error">Error loading items.</Notice>}>
      <ClientComponent query={query} defaultColumns={defaultColumns} collapsed={collapsed}/>
    </ErrorBoundary>
  );
};
