import 'server-only';

import { FC } from 'react';
import { ItemTable as ClientComponent } from './ItemTable.client';
import { DefaultColumnName } from './columns';
import { ItemTableQuery, Signed, sign } from './query';
import { ErrorBoundary } from 'react-error-boundary';
import { Notice } from '../Notice/Notice';

interface ItemTableProps {
  query: ItemTableQuery;
  defaultColumns?: DefaultColumnName[];
  collapsed?: boolean;
};

export const ItemTable: FC<ItemTableProps> = async ({ query, defaultColumns, ...props }) => {
  const signedQuery = await sign(query);

  return (
    <ErrorBoundary fallback={<Notice type="error">Error loading items.</Notice>}>
      <ClientComponent query={signedQuery} defaultColumns={defaultColumns} {...props}/>
    </ErrorBoundary>
  );
};
