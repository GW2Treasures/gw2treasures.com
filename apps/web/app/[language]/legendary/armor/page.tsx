import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import type { Metadata } from 'next';
import { createItemTable, LegendaryItemDataTable } from '../table';
import { TableFilterButton, TableFilterProvider, type TableFilterDefinition } from '@/components/Table/TableFilter';
import type { SubType } from '@/components/Item/ItemType.types';
import { pageView } from '@/lib/pageView';

const legendaryRuneId = 91536;

const loadItems = cache(async () => {
  const items = await db.item.findMany({
    where: { OR: [{ type: 'Armor' }, { id: legendaryRuneId }], legendaryArmoryMaxCount: { not: null }},
    select: {
      ...linkProperties,
      type: true, subtype: true,
      legendaryArmoryMaxCount: true
    }
  });

  return items;
}, ['legendary-armor'], { revalidate: 60 * 60 });

export default async function LegendaryRelicsPage({ params }: PageProps) {
  const { language } = await params;
  const t = getTranslate(language);

  await pageView('legendary/armor');

  const items = await loadItems();
  const Items = createItemTable(items);

  // TODO: add filtering by weight
  const types = Array.from(new Set(items.map(({ type, subtype }) => type === 'Back' ? 'Back' : `${type}.${subtype}`))) as (`Armor.${SubType<'Armor'>}` | 'Back' | `UpgradeComponent.${SubType<'UpgradeComponent'>}`)[];
  const armorFilter: TableFilterDefinition[] = types.map((type) => ({
    id: type,
    name: type === 'Back' ? t('item.type.Back') : t(`item.type.short.${type}`),
    rowIndexes: items.map(({ type, subtype }, index) => [type === 'Back' ? 'Back' : `${type}.${subtype}`, index] as const)
      .filter(([ itemType ]) => type === itemType)
      .map(([, index]) => index)
  })).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <TableFilterProvider filter={armorFilter}>
      <Notice icon="eye" index={false}>This is a preview page and more features will be added in the future.</Notice>
      <Description actions={[<TableFilterButton key="filter" totalCount={items.length}/>, <ColumnSelect key="columns" table={Items}/>]}>
        <Trans id="legendary-armory.armor.description"/>
      </Description>
      <LegendaryItemDataTable language={language} table={Items} filtered/>
    </TableFilterProvider>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('legendary-armory.armor.title'),
    description: t('legendary-armory.armor.description'),
  };
}
