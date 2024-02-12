import type { DataTableColumnSelectionProps } from '@gw2treasures/ui/components/Table/DataTable';
import type { FC, ReactNode } from 'react';
import { Trans } from '../I18n/Trans';

export interface ColumnSelectProps {
  table: { ColumnSelection: FC<DataTableColumnSelectionProps> }
  children?: ReactNode
}

export const ColumnSelect: FC<ColumnSelectProps> = ({ table: { ColumnSelection }, children }) => {
  return (
    <ColumnSelection reset={<Trans id="table.columns.reset"/>}>{children ?? <Trans id="table.columns"/>}</ColumnSelection>
  );
};
