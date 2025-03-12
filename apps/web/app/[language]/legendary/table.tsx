import type { FC } from 'react';
import type { LocalizedEntity } from '@/lib/localizedName';
import type { Item, Language } from '@gw2treasures/database';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { ItemLink } from '@/components/Item/ItemLink';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { LegendaryArmoryCell } from './table.client';
import { requiredScopes } from './helper';
import { Trans } from '@/components/I18n/Trans';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Icon } from '@gw2treasures/ui';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { encode } from 'gw2e-chat-codes';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { TableFilterRow } from '@gw2treasures/ui/components/Table/TableFilter';
import { ItemType } from '@/components/Item/ItemType';
import { translations as itemTypeTranslations } from '@/components/Item/ItemType.translations';
import { translateMany } from '@/lib/translate';

export function createItemTable(items: Pick<Item, keyof LocalizedEntity | 'id' | 'rarity' | 'legendaryArmoryMaxCount' | 'type' | 'subtype'>[]) {
  return createDataTable(items, ({ id }) => id);
}

interface LegendaryItemDataTableProps {
  language: Language,
  table: ReturnType<typeof createItemTable>,
  filtered?: boolean,
}

export const LegendaryItemDataTable: FC<LegendaryItemDataTableProps> = ({ language, table: items, filtered }) => {
  return (
    <items.Table rowFilter={filtered ? TableFilterRow : undefined}>
      <items.Column id="id" title={<Trans id="itemTable.column.id"/>} small hidden align="right">{({ id }) => id}</items.Column>
      <items.Column id="item" title={<Trans id="itemTable.column.item"/>} fixed>{(item) => <ItemLink item={item}/>}</items.Column>
      <items.Column id="type" title={<Trans id="itemTable.column.type"/>} sortBy={({ subtype }) => subtype}>{(item) => <ItemType type={item.type as never} subtype={item.subtype as never} translations={translateMany(itemTypeTranslations.short, language)} display="short"/>}</items.Column>
      <items.Column id="maxCount" title={<Trans id="legendary-armory.max-count"/>}>{(item) => <FormatNumber value={item.legendaryArmoryMaxCount}/>}</items.Column>
      <items.DynamicColumns id="account-unlock" title="Account Unlocks" headers={<Gw2AccountHeaderCells small requiredScopes={requiredScopes}/>}>
        {(item) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><LegendaryArmoryCell itemId={item.id} accountId={undefined as never} maxCount={item.legendaryArmoryMaxCount}/></Gw2AccountBodyCells>}
      </items.DynamicColumns>
      <items.Column id="actions" title="" small fixed>
        {({ id }) => (
          <DropDown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right-start">
            <MenuList>
              <LinkButton appearance="menu" icon="eye" href={`/item/${id}`}>View Item</LinkButton>
              <CopyButton appearance="menu" icon="chatlink" copy={encode('recipe', id) || ''}><Trans id="chatlink.copy"/></CopyButton>
              <LinkButton appearance="menu" icon="external" href={`https://gw2efficiency.com/crafting/calculator/a~0!b~1!c~0!d~1-${id}`} target="_blank" rel="noreferrer noopener">gw2efficiency</LinkButton>
              <LinkButton appearance="menu" icon="external" href={`https://api.guildwars2.com/v2/recipes/${id}?v=latest`} target="_blank" rel="noreferrer noopener">API</LinkButton>
            </MenuList>
          </DropDown>
        )}
      </items.Column>
    </items.Table>
  );
};
