import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate, translateMany } from '@/lib/translate';
import { createItemTable, LegendaryItemDataTable } from '../table';
import { pageView } from '@/lib/pageView';
import { createMetadata } from '@/lib/metadata';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { requiredScopes } from '../helper';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { LegendaryTrinketOverviewAccountRows } from './overview.client';
import type { Slot } from './types';

const ignoredItems = [
  95093, // Legendary Equipment Unlocked!
];

const loadItems = cache(async () => {
  const items = await db.item.findMany({
    where: {
      type: { in: ['Trinket', 'Back', 'Relic'] },
      legendaryArmoryMaxCount: { not: null },
      id: { notIn: ignoredItems },
    },
    select: {
      ...linkProperties,
      type: true, subtype: true,
      legendaryArmoryMaxCount: true
    },
    orderBy: [{ type: 'asc' }, { subtype: 'asc' }]
  });

  return items;
}, ['legendary-trinkets'], { revalidate: 60 * 60 });

export default async function LegendaryRelicsPage() {
  const language = await getLanguage();

  await pageView('legendary/trinkets');

  const items = await loadItems();
  const Items = createItemTable(items);

  const translations = await translateMany([
    'item.type.Back',
    'item.type.Relic',
    'item.type.Trinket.Accessory',
    'item.type.Trinket.Amulet',
    'item.type.Trinket.Ring',
  ], language);

  const slotByItemId = Object.fromEntries(items.map(({ id, type, subtype }) => [id, type === 'Back' || type === 'Relic' ? type : subtype])) as Record<number, Slot>;

  return (
    <>
      <Gw2Accounts requiredScopes={requiredScopes} authorizationMessage={null} loginMessage={null} loading={null}>
        <Headline id="overview">
          <Trans id="legendary-armory.armor.overview"/>
        </Headline>

        <Table>
          <thead>
            <tr>
              <Table.HeaderCell><Trans id="wizards-vault.account"/></Table.HeaderCell>
              <Table.HeaderCell small><Trans id="legendary-armory.relics.unlocks"/></Table.HeaderCell>
            </tr>
          </thead>
          <tbody>
            <LegendaryTrinketOverviewAccountRows slotByItemId={slotByItemId} translations={translations}/>
          </tbody>
        </Table>
      </Gw2Accounts>

      <Description actions={<ColumnSelect table={Items}/>}>
        <Trans id="legendary-armory.trinkets.description"/>
      </Description>
      <LegendaryItemDataTable language={language} table={Items}/>
    </>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('legendary-armory.trinkets.title'),
    description: t('legendary-armory.trinkets.description'),
  };
});
