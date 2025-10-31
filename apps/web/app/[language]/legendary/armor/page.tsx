import { Trans } from '@/components/I18n/Trans';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import { createItemTable, LegendaryItemDataTable } from '../table';
import { TableFilterButton, TableFilterProvider, type TableFilterDefinition } from '@/components/Table/TableFilter';
import type { SubType } from '@/components/Item/ItemType.types';
import { pageView } from '@/lib/pageView';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { requiredScopes } from '../helper';
import { LegendaryArmorOverviewCell } from './overview.client';
import type { ArmorSlot, ArmorWeight } from './types';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { createMetadata } from '@/lib/metadata';

const loadItems = cache(async () => {
  const items = await db.item.findMany({
    where: { type: 'Armor', legendaryArmoryMaxCount: { not: null }},
    select: {
      ...linkProperties,
      type: true, subtype: true,
      weight: true,
      legendaryArmoryMaxCount: true
    }
  });

  const itemIdsByWeightBySlot: Record<ArmorWeight, Record<ArmorSlot, number[]>> = {
    Light: { Helm: [], Shoulders: [], Coat: [], Gloves: [], Leggings: [], Boots: [], HelmAquatic: [] },
    Medium: { Helm: [], Shoulders: [], Coat: [], Gloves: [], Leggings: [], Boots: [], HelmAquatic: [] },
    Heavy: { Helm: [], Shoulders: [], Coat: [], Gloves: [], Leggings: [], Boots: [], HelmAquatic: [] },
  };

  for(const item of items) {
    itemIdsByWeightBySlot[item.weight as ArmorWeight][item.subtype as ArmorSlot].push(item.id);
  }

  return { items, itemIdsByWeightBySlot };
}, ['legendary-armor'], { revalidate: 60 * 60 });

export default async function LegendaryRelicsPage() {
  const language = await getLanguage();
  const t = getTranslate(language);

  await pageView('legendary/armor');

  const { items, itemIdsByWeightBySlot } = await loadItems();
  const Items = createItemTable(items);

  // TODO: add filtering by weight
  const types = Array.from(new Set(items.map(({ type, subtype }) => `${type}.${subtype}`))) as `Armor.${SubType<'Armor'>}`[];
  const armorFilter: TableFilterDefinition[] = types.map((type) => ({
    id: type,
    name: t(`item.type.short.${type}`),
    rowIndexes: items.map(({ type, subtype }, index) => [`${type}.${subtype}`, index] as const)
      .filter(([ itemType ]) => type === itemType)
      .map(([, index]) => index)
  })).sort((a, b) => a.name.localeCompare(b.name));

  const Overview = createDataTable<ArmorWeight>(['Light', 'Medium', 'Heavy'], (w) => w);

  return (
    <>
      <Gw2Accounts requiredScopes={requiredScopes} authorizationMessage={null} loginMessage={null} loading={null}>
        <Headline id="overview">
          <Trans id="legendary-armory.armor.overview"/>
        </Headline>

        <Overview.Table>
          <Overview.Column id="weight" title={<Trans id="itemTable.column.weight"/>}>
            {(weight) => <Trans id={`weight.${weight}`}/>}
          </Overview.Column>
          <Overview.DynamicColumns id="account-unlock" title="Account Unlocks" headers={<Gw2AccountHeaderCells small requiredScopes={requiredScopes}/>}>
            {(weight) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><LegendaryArmorOverviewCell accountId={undefined as never} itemIdsBySlot={itemIdsByWeightBySlot[weight]}/></Gw2AccountBodyCells>}
          </Overview.DynamicColumns>
        </Overview.Table>
      </Gw2Accounts>

      <TableFilterProvider filter={armorFilter}>
        <Headline id="armor" actions={[<TableFilterButton key="filter" totalCount={items.length}/>, <ColumnSelect key="columns" table={Items}/>]}>
          <Trans id="legendary-armory.armor.title"/>
        </Headline>
        <p>
          <Trans id="legendary-armory.armor.description"/>
        </p>
        <LegendaryItemDataTable language={language} table={Items} filtered/>
      </TableFilterProvider>
    </>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('legendary-armory.armor.title'),
    description: t('legendary-armory.armor.description'),
  };
});
