import 'server-only';

import { ItemTable as ClientComponent } from './ItemTable.client';
import { globalColumnDefinitions } from './columns';
import { type Signed, sign } from './query';
import { ErrorBoundary } from 'react-error-boundary';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { getLanguage, getTranslate } from '@/lib/translate';
import type { AvailableColumn, AvailableColumns, ExtraColumn, GlobalColumnId, ItemTableQuery, OrderBy, QueryModel } from './types';

export interface ItemTableProps<ExtraColumnId extends string, Model extends QueryModel> {
  query: ItemTableQuery<Model>;
  defaultColumns?: (ExtraColumnId | GlobalColumnId)[];
  collapsed?: boolean;
  extraColumns?: ExtraColumn<ExtraColumnId, Model, any>[]
};

export const ItemTable = async <ExtraColumnId extends string = never, Model extends QueryModel = 'item'>({ query, extraColumns, ...props }: ItemTableProps<ExtraColumnId, Model>) => {
  const signedQuery = await sign(query);
  const availableColumns = await getColumns(extraColumns, query.mapToItem);

  return (
    <ErrorBoundary fallback={<Notice type="error">Error loading items.</Notice>}>
      <ClientComponent query={signedQuery} availableColumns={availableColumns} {...props}/>
    </ErrorBoundary>
  );
};

async function getColumns<T extends string>(extraColumns: ExtraColumn<T, any, any>[] | undefined, mapToItem?: string): Promise<AvailableColumns<GlobalColumnId | T>> {
  const columns = Object.values(globalColumnDefinitions);
  const language = getLanguage();
  const translate = getTranslate(language);

  const entries = await Promise.all([
    ...columns.map(async (column) => {
      const id = column.id;
      const title = translate(`itemTable.column.${id}`);
      const select = await sign(mapToItem ? { [mapToItem]: { select: column.select }} : column.select);
      const orderBy = column.orderBy
        ? await Promise.all(column.orderBy.map((order) => {
          if(!mapToItem) {
            return order;
          }

          return Array.isArray(order) ? order.map((by) => ({ [mapToItem]: by })) : { [mapToItem]: order };
        }).map(sign)) as [asc: Signed<OrderBy>, desc: Signed<OrderBy>]
        : undefined;
      const align = column.align;
      const small = column.small;
      const order = column.order;
      const globalColumnId = await sign(id);

      return [id, { id, title, select, orderBy, align, small, order, globalColumnId }] as [GlobalColumnId | T, AvailableColumn<GlobalColumnId | T> & { order?: number }];
    }),
    ...extraColumns?.map(async (column) => {
      const id = column.id;
      const title = column.title;
      const select = await sign(column.select);
      const component = column.component;
      const orderBy = column.orderBy
        ? await Promise.all(column.orderBy.map(sign)) as [asc: Signed<OrderBy>, desc: Signed<OrderBy>]
        : undefined;
      const align = column.align;
      const small = column.small;
      const order = column.order;

      return [id, { id, title, select, orderBy, align, small, component, order }] as [GlobalColumnId | T, AvailableColumn<GlobalColumnId | T, any, any> & { order?: number }];
    }) ?? []
  ]);

  return Object.fromEntries(entries.sort(([, { order: orderA }], [, { order: orderB }]) => {
    if(orderA === undefined && orderB === undefined) {
      return 0;
    }

    if(orderA === undefined) {
      return 1;
    }

    if(orderB === undefined) {
      return -1;
    }

    return orderA - orderB;
  })) as AvailableColumns<GlobalColumnId | T>;
}
