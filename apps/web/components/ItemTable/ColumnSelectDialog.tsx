import { FC } from 'react';
import { ItemTableProps } from './ItemTable.client';
import { DefaultColumnName } from './columns';
import { DropDown } from '../DropDown/DropDown';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { MenuList } from '../MenuList/MenuList';
import { Separator } from '../Layout/Separator';

export interface ColumnSelectDialogProps {
  availableColumns: ItemTableProps['availableColumns'];
  columns: DefaultColumnName[];
  defaultColumns: DefaultColumnName[];

  onChange: (columns: DefaultColumnName[]) => void;
};

export const ColumnSelectDialog: FC<ColumnSelectDialogProps> = ({ availableColumns, columns, defaultColumns, onChange }) => {
  const values = Object.values(availableColumns);

  return (
    <DropDown button={<Button icon="columns">Columns</Button>} preferredPlacement="right-start">
      <MenuList>
        {values.map((column) => (
          <Checkbox key={column.id} checked={columns.includes(column.id)} onChange={(checked) => onChange(values.filter(({ id }) => id !== column.id ? columns.includes(id) : checked).map(({ id }) => id))}>{column.title}</Checkbox>
        ))}
        <Separator/>
        <Button appearance="menu" onClick={() => onChange(defaultColumns)}>Reset to default</Button>
      </MenuList>
    </DropDown>
  );
};
