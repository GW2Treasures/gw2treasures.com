import 'server-only';

import { FC } from 'react';
import { ItemTable as ClientComponent } from './ItemTable.client';
import { DefaultColumnName, defaultColumnDefinitions } from './columns';
import { ItemTableQuery, Signed, sign } from './query';
import { ErrorBoundary } from 'react-error-boundary';
import { Notice } from '../Notice/Notice';
import { Prisma } from '@gw2treasures/database';
import { getLanguage, getTranslate } from '../I18n/getTranslate';

interface ItemTableProps {
  query: ItemTableQuery;
  defaultColumns?: DefaultColumnName[];
  collapsed?: boolean;
};

export const ItemTable: FC<ItemTableProps> = async ({ query, defaultColumns, ...props }) => {
  const signedQuery = await sign(query);
  const availableColumns = await getColumns();

  return (
    <ErrorBoundary fallback={<Notice type="error">Error loading items.</Notice>}>
      <ClientComponent query={signedQuery} defaultColumns={defaultColumns} availableColumns={availableColumns} {...props}/>
    </ErrorBoundary>
  );
};

async function getColumns() {
  const columns = Object.values(defaultColumnDefinitions);
  const language = getLanguage();
  const translate = getTranslate(language);

  const entries = await Promise.all(columns.map(async (column) => {
    const id = column.id;
    const title = translate(`itemTable.column.${id}`);
    const select = await sign(column.select);
    const orderBy = column.orderBy
      ? await Promise.all(column.orderBy.map(sign)) as [asc: Signed<Prisma.ItemOrderByWithRelationInput>, desc: Signed<Prisma.ItemOrderByWithRelationInput>]
      : undefined;

    return [id, { id, title, select, orderBy }];
  }));

  return Object.fromEntries(entries);
}
