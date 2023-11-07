'use client';

import type { FC } from 'react';
import { DropDown } from '../DropDown/DropDown';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { MenuList } from '../MenuList/MenuList';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { useItemTableContext } from './context';

export interface ItemTableColumnsButtonProps {};

export const ItemTableColumnsButton: FC<ItemTableColumnsButtonProps> = () => {
  const { availableColumns, selectedColumns, defaultColumns, setSelectedColumns } = useItemTableContext();
  const columns = selectedColumns ?? defaultColumns;

  const values = Object.values(availableColumns);

  return (
    <DropDown button={<Button icon="columns">Columns</Button>} preferredPlacement="right-start">
      <MenuList>
        {values.map((column) => (
          <Checkbox key={column.id} checked={columns.includes(column.id)} onChange={(checked) => setSelectedColumns(values.filter(({ id }) => id !== column.id ? columns.includes(id) : checked).map(({ id }) => id))}>{column.title}</Checkbox>
        ))}
        <Separator/>
        <Button appearance="menu" onClick={() => setSelectedColumns(undefined)} disabled={selectedColumns === undefined}>Reset to default</Button>
      </MenuList>
    </DropDown>
  );
};
