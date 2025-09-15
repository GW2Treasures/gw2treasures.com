'use client';

import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Signed } from './query';
import { type ItemTableLoadOptions } from './ItemTable.actions';
import { SkeletonTable } from '../Skeleton/SkeletonTable';
import { globalColumnRenderer } from './columns';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Icon } from '@gw2treasures/ui';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { encode } from 'gw2e-chat-codes';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { Pagination, type PaginationProps } from '../Pagination/Pagination';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { TableRowButton } from '@gw2treasures/ui/components/Table/TableRowButton';
import { Skeleton } from '../Skeleton/Skeleton';
import { useItemTableContext } from './context';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import type { AvailableColumns, GlobalColumnId, ItemTableQuery, LoadItemsResult, QueryModel } from './types';
import { getHistoryState, updateHistoryState } from './history-state';
import type { TranslationId, TranslationSubset } from '@/lib/translate';
import { FormatNumber } from '../Format/FormatNumber';
import { useLanguage } from '../I18n/Context';
import scrollIntoView from 'scroll-into-view-if-needed';

const LOADING = false;
type LOADING = typeof LOADING;

export interface ItemTableProps<ExtraColumnId extends string, Model extends QueryModel> {
  query: Signed<ItemTableQuery<Model>>;
  defaultColumns?: (GlobalColumnId | ExtraColumnId)[];
  availableColumns: AvailableColumns<GlobalColumnId | ExtraColumnId>;
  collapsed?: boolean;
  pageSize?: number;
  translations: PaginationProps['translations'] & TranslationSubset<'itemTable.viewItem' | 'chatlink.copy' | 'actions'>
}

const globalDefaultColumns: GlobalColumnId[] = [
  'item', 'level', 'rarity', 'type', 'vendorValue',
];

export const ItemTable = <ExtraColumnId extends string = never, Model extends QueryModel = 'item'>({ query, defaultColumns = globalDefaultColumns, availableColumns, collapsed: initialCollapsed, translations, pageSize = 10 }: ItemTableProps<ExtraColumnId, Model>) => {
  type ColumnId = ExtraColumnId | GlobalColumnId;
  const { setDefaultColumns, setAvailableColumns, selectedColumns, id, isGlobalContext } = useItemTableContext<ColumnId>();

  const [items, setItems] = useState<{ id: number }[] | LOADING>(LOADING);
  const [totalItems, setTotalItems] = useState(3);
  const [page, setPage] = useState(getHistoryState(id).page ?? 0);
  const [collapsed, setCollapsed] = useState(initialCollapsed && isEmptyObject(getHistoryState(id)));
  const [loadedColumns, setLoadedColumns] = useState<ColumnId[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState<{ column: ColumnId, order: 'asc' | 'desc' } | undefined>(getHistoryState<ColumnId>(id).orderBy);
  const [range, setRange] = useState<{ length: number, offset: number }>();
  const [dynamicTranslations, setDynamicTranslations] = useState<Partial<Record<TranslationId, string>>>({});

  const requestId = useRef(0);

  const collapsedSize = 5;

  useEffect(() => {
    // show loading skeleton when the query changes
    setItems(LOADING);
  }, [query]);

  useEffect(() => setDefaultColumns(defaultColumns), [setDefaultColumns, defaultColumns]);
  useEffect(() => setAvailableColumns(availableColumns), [setAvailableColumns, availableColumns]);

  const columns = useMemo(() => {
    return (selectedColumns ?? defaultColumns).map(
      (id) => availableColumns[id]
    );
  }, [availableColumns, selectedColumns, defaultColumns]);

  useEffect(() => {
    const take = collapsed ? collapsedSize : pageSize;
    const skip = collapsed ? 0 : pageSize * page;
    const options = {
      columns: columns.map(({ globalColumnId, select }) => globalColumnId ?? select),
      orderBy: orderBy ? columns.find(({ id }) => id === orderBy.column)?.orderBy?.[orderBy.order === 'desc' ? 1 : 0] : undefined,
      take, skip
    };
    setLoading(true);
    const currentRequestId = ++requestId.current;
    loadItems(query, options, id).then(({ items, translations: dynamicTranslations }) => {
      if(currentRequestId !== requestId.current) {
        return;
      }
      setItems(items);
      setDynamicTranslations(dynamicTranslations);
      setLoadedColumns(columns.map(({ id }) => id));
      setLoading(false);
      setRange({ length: items.length, offset: skip });
    });
  }, [collapsed, columns, orderBy, page, query, id, pageSize]);

  useEffect(() => {
    loadTotalItemCount(query, id).then(setTotalItems);
  }, [query, id]);

  useEffect(() => updateHistoryState(id, { page }), [id, page]);
  useEffect(() => updateHistoryState(id, { orderBy }), [id, orderBy]);

  // ensure the top of the table is visible inside the viewport when changing page
  const topRef = useRef<HTMLTableElement>(null);
  useEffect(() => {
    if(topRef.current) {
      scrollIntoView(topRef.current, {
        behavior: 'smooth',
        block: 'start',
        scrollMode: 'if-needed',
      });
    }
  }, [page]);

  const handleSort = useCallback((column: ColumnId) => {
    setCollapsed(false);
    setOrderBy(
      (orderBy) => orderBy?.column !== column || orderBy?.order !== 'desc'
        ? { column, order: orderBy?.column !== column ? 'asc' : 'desc' }
        : undefined
    );
  }, []);

  const language = useLanguage();

  if(items === LOADING) {
    return (<SkeletonTable icons columns={columns.map((column) => column.title)} rows={Math.min(totalItems, collapsed ? collapsedSize : pageSize)}/>);
  }

  return (
    <>
      {process.env.NODE_ENV === 'development' && isGlobalContext && (<Notice type="warning">Missing ItemTableContext</Notice>)}
      <Table ref={topRef}>
        <thead>
          <tr>
            {columns.map((column) => (
              <Table.HeaderCell key={column.id} align={column.align} small={column.small} sort={column.orderBy && (column.id === orderBy?.column ? orderBy?.order : true)} onSort={() => handleSort(column.id)}>
                {column.title}
              </Table.HeaderCell>
            ))}
            <Table.HeaderCell small/>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const properties = query.data.mapToItem && query.data.model !== undefined && query.data.model !== 'item'
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ? { item: (item as any)[query.data.mapToItem], [query.data.model]: item, translations: dynamicTranslations }
              : { item, translations: dynamicTranslations };

            return (
              <tr key={item.id ?? properties.item.id}>
                {columns.map((column) => {
                  return (
                    <td key={column.id} align={column.align}>
                      {loadedColumns.includes(column.id) ? (
                        column.component
                          ? createElement(column.component, { ...properties, ...column.componentProps })
                          : globalColumnRenderer[column.id as GlobalColumnId](properties.item, properties.translations as Record<TranslationId, string>, language)
                      ) : <Skeleton width={48}/>}
                    </td>
                  );
                })}
                <td>
                  <DropDown button={<Button iconOnly appearance="menu" aria-label={translations['actions']}><Icon icon="more"/></Button>} preferredPlacement="right-start">
                    <MenuList>
                      <LinkButton appearance="menu" icon="eye" href={`/item/${item.id}`}>{translations['itemTable.viewItem']}</LinkButton>
                      <CopyButton appearance="menu" icon="chatlink" copy={encode('item', item.id) || ''}>{translations['chatlink.copy']}</CopyButton>
                    </MenuList>
                  </DropDown>
                </td>
              </tr>
            );
          })}
          {collapsed && totalItems > collapsedSize && (
            <TableRowButton key="show-more" onClick={() => setCollapsed(false)}><Icon icon="chevron-down"/> Show <FormatNumber value={totalItems - collapsedSize}/> more</TableRowButton>
          )}
        </tbody>
      </Table>
      {!collapsed && (
        <FlexRow align="space-between">
          <div>
            Showing <b><FormatNumber value={range ? range.offset + 1 : 0}/>&ndash;<FormatNumber value={(range?.offset ?? 0) + (range?.length ?? 0)}/></b> of <b><FormatNumber value={totalItems}/></b> items
          </div>
          <Pagination disabled={loading} current={page} total={Math.ceil(totalItems / pageSize)} onPageChange={setPage} translations={translations}/>
        </FlexRow>
      )}
    </>
  );
};

function loadItems<Model extends QueryModel>(query: Signed<ItemTableQuery<Model>>, options: ItemTableLoadOptions<Model>, id: string): LoadItemsResult {
  return fetch(`/api/item/item-table?${encodeURIComponent(id)}`, {
    method: 'POST',
    body: JSON.stringify({ query, options }),
    headers: { 'content-type': 'application/json' }
  }).then((r) => r.json());
}

function loadTotalItemCount<Model extends QueryModel>(query: Signed<ItemTableQuery<Model>>, id: string): Promise<number> {
  return fetch(`/api/item/item-table?${encodeURIComponent(id)}&count`, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: { 'content-type': 'application/json' }
  }).then((r) => r.json());
}
