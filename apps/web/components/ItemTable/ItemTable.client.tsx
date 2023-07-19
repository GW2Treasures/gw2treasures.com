'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { Signed, ItemTableQuery } from './query';
import { loadItems, loadTotalItemCount } from './ItemTable.actions';
import { SkeletonTable } from '../Skeleton/SkeletonTable';
import { DefaultColumnName, defaultColumnDefinitions } from './columns';
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
import { Prisma } from '@gw2treasures/database';

const LOADING = false;
type LOADING = typeof LOADING;

export interface ItemTableProps {
  query: Signed<ItemTableQuery>;
  defaultColumns?: DefaultColumnName[];
  availableColumns: Record<DefaultColumnName, { title: string, select: Signed<Prisma.ItemSelect> }>;
  collapsed?: boolean;
};

const globalDefaultColumns: DefaultColumnName[] = [
  'item', 'level', 'rarity', 'type', 'vendorValue',
];

export const ItemTable: FC<ItemTableProps> = ({ query, defaultColumns, availableColumns, collapsed: defaultCollapsed }) => {
  const [items, setItems] = useState<{ id: number }[] | LOADING>(LOADING);
  const [totalItems, setTotalItems] = useState(3);
  const [page, setPage] = useState(0);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const pageSize = 10;
  const collapsedSize = 5;

  useEffect(() => {
    // show loading skeleton when the query changes
    setItems(LOADING);
  }, [query]);

  const columns = useMemo(() => {
    return (defaultColumns ?? globalDefaultColumns).map(
      (id) => ({ id, align: defaultColumnDefinitions[id].align, render: defaultColumnDefinitions[id].render, ...availableColumns[id] })
    );
  }, [availableColumns, defaultColumns]);

  useEffect(() => {
    const take = collapsed ? 5 : pageSize;
    const skip = collapsed ? 0 : pageSize * page;
    loadItems(query, { columns: columns.map(({ select }) => select), take, skip }).then(setItems);
  }, [collapsed, columns, page, query]);

  useEffect(() => {
    loadTotalItemCount(query).then(setTotalItems);
  }, [query]);

  if(items === LOADING) {
    return (<SkeletonTable icons columns={columns.map((column) => column.title)} rows={Math.min(totalItems, pageSize)}/>);
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            {columns.map((column) => <Table.HeaderCell key={column.id} align={column.align}>{column.title}</Table.HeaderCell>)}
            <Table.HeaderCell small>&nbsp;</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => <td key={column.id} align={column.align}>{column.render(item as any)}</td>)}
              <td>
                <DropDown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right-start">
                  <MenuList>
                    <LinkButton appearance="menu" icon="eye" href={`/item/${item.id}`}>View Item</LinkButton>
                    <CopyButton appearance="menu" icon="chatlink" copy={encode('item', item.id) || ''}>Copy chatlink</CopyButton>
                  </MenuList>
                </DropDown>
              </td>
            </tr>
          ))}
          {collapsed && (
            <TableRowButton key="show-more" onClick={() => setCollapsed(false)}><Icon icon="chevronDown"/> Show {totalItems - collapsedSize} more</TableRowButton>
          )}
        </tbody>
      </Table>
      {!collapsed && (
        <FlexRow align="space-between">
          <div>
            Showing <b>{items.length}</b> of <b>{totalItems}</b> items
          </div>
          <Pagination current={page} total={Math.ceil(totalItems / pageSize)} onPageChange={setPage}/>
        </FlexRow>
      )}
    </>
  );
};
