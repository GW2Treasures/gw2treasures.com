'use client';

import type { FC } from 'react';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { useItemTableContext } from './context';
import { Icon } from '@gw2treasures/ui';
import { useUser } from '../User/use-user';

export interface ItemTableColumnsButtonProps {};

export const ItemTableColumnsButton: FC<ItemTableColumnsButtonProps> = () => {
  const { user } = useUser();
  const { availableColumns, selectedColumns, defaultColumns, setSelectedColumns } = useItemTableContext();
  const columns = selectedColumns ?? defaultColumns;

  const values = Object.values(availableColumns);

  return (
    <DropDown button={<Button icon="columns">Columns</Button>} preferredPlacement="right-start">
      <MenuList>
        {!user && (
          <div style={{ display: 'flex', gap: 12, padding: '4px 16px', maxWidth: 200, alignItems: 'center', background: 'var(--color-background-light)', border: '1px solid var(--color-border-dark)', lineHeight: 1.5, marginBottom: 8, borderRadius: 2 }}>
            <Icon icon="cookie"/>
            Changing columns will store cookies in your browser
          </div>
        )}
        {values.map((column) => (
          <Checkbox key={column.id} checked={columns.includes(column.id)} onChange={(checked) => setSelectedColumns(values.filter(({ id }) => id !== column.id ? columns.includes(id) : checked).map(({ id }) => id))}>{column.title}</Checkbox>
        ))}
        <Separator/>
        <Button appearance="menu" onClick={() => setSelectedColumns(undefined)} disabled={selectedColumns === undefined}>Reset to default</Button>
      </MenuList>
    </DropDown>
  );
};
