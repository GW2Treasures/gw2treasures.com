'use client';

import { createElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Signed } from './query';
import { loadItems, loadTotalItemCount } from './ItemTable.actions';
import { SkeletonTable } from '../Skeleton/SkeletonTable';
import { globalColumnRenderer } from './columns';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { DropDown } from '../DropDown/DropDown';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Icon } from '@gw2treasures/ui';
import { MenuList } from '../MenuList/MenuList';
import { encode } from 'gw2e-chat-codes';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { Pagination } from '../Pagination/Pagination';
import { FlexRow } from '../Layout/FlexRow';
import { TableRowButton } from '@gw2treasures/ui/components/Table/TableRowButton';
import { Skeleton } from '../Skeleton/Skeleton';
import { useItemTableContext } from './context';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { AvailableColumns, GlobalColumnId, ItemTableQuery, QueryModel } from './types';

const LOADING = false;
type LOADING = typeof LOADING;

export interface ItemTableProps<ExtraColumnId extends string, Model extends QueryModel> {
  query: Signed<ItemTableQuery<Model>>;
  defaultColumns?: (GlobalColumnId | ExtraColumnId)[];
  availableColumns: AvailableColumns<GlobalColumnId | ExtraColumnId>;
  collapsed?: boolean;
};

const globalDefaultColumns: GlobalColumnId[] = [
  'item', 'level', 'rarity', 'type', 'vendorValue',
];

export const ItemTable = <ExtraColumnId extends string = never, Model extends QueryModel = 'item'>({ query, defaultColumns = globalDefaultColumns, availableColumns, collapsed: initialCollapsed }: ItemTableProps<ExtraColumnId, Model>) => {
  type ColumnId = ExtraColumnId | GlobalColumnId;
  const { setDefaultColumns, setAvailableColumns, selectedColumns, isGlobalContext } = useItemTableContext<ColumnId>();

  const [items, setItems] = useState<{ id: number }[] | LOADING>(LOADING);
  const [totalItems, setTotalItems] = useState(3);
  const [page, setPage] = useState(0);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [loadedColumns, setLoadedColumns] = useState<ColumnId[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState<{ column: ColumnId, order: 'asc' | 'desc'}>();
  const [range, setRange] = useState<{ length: number, offset: number }>();

  const pageSize = 10;
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
      columns: columns.map(({ select }) => select),
      orderBy: orderBy ? columns.find(({ id }) => id === orderBy.column)?.orderBy?.[orderBy.order === 'desc' ? 1 : 0] : undefined,
      take, skip
    };
    setLoading(true);
    loadItems(query, options).then((items) => {
      setItems(items);
      setLoadedColumns(columns.map(({ id }) => id));
      setLoading(false);
      setRange({ length: items.length, offset: skip });
    });
  }, [collapsed, columns, orderBy, page, query]);

  useEffect(() => {
    loadTotalItemCount(query).then(setTotalItems);
  }, [query]);

  const handleSort = useCallback((column: ColumnId) => {
    setCollapsed(false);
    setOrderBy(
      (orderBy) => orderBy?.column !== column || orderBy?.order !== 'desc'
        ? { column, order: orderBy?.column !== column ? 'asc' : 'desc' }
        : undefined
    );
  }, []);

  if(items === LOADING) {
    return (<SkeletonTable icons columns={columns.map((column) => column.title)} rows={Math.min(totalItems, collapsed ? collapsedSize : pageSize)}/>);
  }

  return (
    <>
      {process.env.NODE_ENV === 'development' && isGlobalContext && (<Notice type="warning">Missing ItemTableContext</Notice>)}
      <Table>
        <thead>
          <tr>
            {columns.map((column) => (
              <Table.HeaderCell key={column.id} align={column.align} sort={column.orderBy && (column.id === orderBy?.column ? orderBy?.order : true)} onSort={() => handleSort(column.id)}>
                {column.title}
              </Table.HeaderCell>
            ))}
            <Table.HeaderCell small/>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const props = query.data.mapToItem && query.data.model !== undefined && query.data.model !== 'item'
            ? { item: (item as any)[query.data.mapToItem], [query.data.model]: item }
            : { item };

            return (
              <tr key={props.item.id}>
                {columns.map((column) => {
                  return (
                    <td key={column.id} align={column.align}>
                      {loadedColumns.includes(column.id) ? (
                        column.component ? createElement(column.component, props) : globalColumnRenderer[column.id as GlobalColumnId](props.item)
                      ) : <Skeleton width={48}/>}
                    </td>
                  );
                })}
                <td>
                  <DropDown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right-start">
                    <MenuList>
                      <LinkButton appearance="menu" icon="eye" href={`/item/${item.id}`}>View Item</LinkButton>
                      <CopyButton appearance="menu" icon="chatlink" copy={encode('item', item.id) || ''}>Copy chatlink</CopyButton>
                    </MenuList>
                  </DropDown>
                </td>
              </tr>
            );
          })}
          {collapsed && totalItems > collapsedSize && (
            <TableRowButton key="show-more" onClick={() => setCollapsed(false)}><Icon icon="chevron-down"/> Show {totalItems - collapsedSize} more</TableRowButton>
          )}
        </tbody>
      </Table>
      {!collapsed && (
        <FlexRow align="space-between">
          <div>
            Showing <b>{range ? range.offset + 1 : 0}&ndash;{(range?.offset ?? 0) + (range?.length ?? 0)}</b> of <b>{totalItems}</b> items
          </div>
          <Pagination disabled={loading} current={page} total={Math.ceil(totalItems / pageSize)} onPageChange={setPage}/>
        </FlexRow>
      )}
    </>
  );
};
