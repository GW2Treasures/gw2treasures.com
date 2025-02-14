import type { FC } from 'react';
import type { LocalizedEntity } from '@/lib/localizedName';
import type { Item } from '@gw2treasures/database';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { ItemLink } from '@/components/Item/ItemLink';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { LegendaryArmoryCell } from './table.client';
import { requiredScopes } from './helper';
import { Trans } from '@/components/I18n/Trans';

export function createItemTable(items: Pick<Item, keyof LocalizedEntity | 'id' | 'rarity'>[]) {
  return createDataTable(items, ({ id }) => id);
}

interface LegendaryItemDataTableProps {
  table: ReturnType<typeof createItemTable>
}

export const LegendaryItemDataTable: FC<LegendaryItemDataTableProps> = ({ table: items }) => {
  return (
    <items.Table>
      <items.Column id="id" title={<Trans id="itemTable.column.id"/>} small hidden align="right">{({ id }) => id}</items.Column>
      <items.Column id="item" title={<Trans id="itemTable.column.item"/>} fixed>{(item) => <ItemLink item={item}/>}</items.Column>
      <items.DynamicColumns headers={<Gw2AccountHeaderCells small requiredScopes={requiredScopes}/>}>
        {(item) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><LegendaryArmoryCell itemId={item.id} accountId={undefined as never}/></Gw2AccountBodyCells>}
      </items.DynamicColumns>
    </items.Table>
  );
};
