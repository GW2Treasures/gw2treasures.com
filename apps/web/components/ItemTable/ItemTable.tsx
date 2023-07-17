'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { ItemTableQuery } from './query';
import { Item } from '@gw2treasures/database';
import { loadItems } from './ItemTable.actions';
import { SkeletonTable } from '../Skeleton/SkeletonTable';
import { DefaultColumnName, defaultColumnDefinitions } from './columns';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { DropDown } from '../DropDown/DropDown';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Icon } from '@gw2treasures/ui';
import { MenuList } from '../MenuList/MenuList';
import { encode } from 'gw2e-chat-codes';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';

const LOADING = false;
type LOADING = typeof LOADING;

export interface ItemTableProps {
  query: ItemTableQuery;
  defaultColumns?: DefaultColumnName[];
};

const globalDefaultColumns = [
  defaultColumnDefinitions.item,
  defaultColumnDefinitions.level,
  defaultColumnDefinitions.rarity,
  defaultColumnDefinitions.type,
  defaultColumnDefinitions.vendorValue,
];

export const ItemTable: FC<ItemTableProps> = ({ query, defaultColumns }) => {
  const [items, setItems] = useState<{ id: number }[] | LOADING>(LOADING);

  const columns = useMemo(() => {
    if(!defaultColumns) {
      return globalDefaultColumns;
    }

    return defaultColumns.map((name) => defaultColumnDefinitions[name]);
  }, [defaultColumns]);

  useEffect(() => {
    setItems(LOADING);
    loadItems(query, { columnSelects: columns.map(({ select }) => select) }).then(setItems);
  }, [columns, query]);

  if(items === LOADING) {
    return (<SkeletonTable columns={columns.map((column) => column.id)}/>);
  }

  return (
    <Table>
      <thead>
        <tr>
          {columns.map((column) => <Table.HeaderCell key={column.id} align={column.align}>{column.id}</Table.HeaderCell>)}
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
      </tbody>
    </Table>
  );
};
