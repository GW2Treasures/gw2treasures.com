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
import { TableFilterButton, TableFilterProvider, type TableFilterDefinition } from '@gw2treasures/ui/components/Table/TableFilter';
import type { SubType } from '@/components/Item/ItemType.types';
import { pageView } from '@/lib/pageView';

const legendarySigilId = 91505;

const loadItems = cache(async () => {
  const items = await db.item.findMany({
    where: { OR: [{ type: 'Weapon' }, { id: legendarySigilId }], legendaryArmoryMaxCount: { not: null }},
    select: {
      ...linkProperties,
      type: true, subtype: true,
      legendaryArmoryMaxCount: true
    }
  });

  return items;
}, ['legendary-weapons'], { revalidate: 60 * 60 });

export default async function LegendaryRelicsPage({ params }: PageProps) {
  const { language } = await params;
  const t = getTranslate(language);

  await pageView('legendary/weapons');

  const items = await loadItems();
  const Items = createItemTable(items);

  const types = Array.from(new Set(items.map(({ type, subtype }) => `${type}.${subtype}`))) as (`Weapon.${SubType<'Weapon'>}` | `UpgradeComponent.${SubType<'UpgradeComponent'>}`)[];
  const weaponFilter: TableFilterDefinition[] = types.map((type) => ({
    id: type,
    name: t(`item.type.short.${type}`),
    rowIndexes: items.map(({ type, subtype }, index) => [`${type}.${subtype}`, index] as const)
      .filter(([ itemType ]) => type === itemType)
      .map(([, index]) => index)
  })).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <TableFilterProvider filter={weaponFilter}>
      <Notice icon="eye" index={false}>This is a preview page and more features will be added in the future.</Notice>
      <Description actions={[<TableFilterButton key="filter" totalCount={items.length}/>, <ColumnSelect key="columns" table={Items}/>]}>
        <Trans id="legendary-armory.weapons.description"/>
      </Description>
      <LegendaryItemDataTable language={language} table={Items}/>
    </TableFilterProvider>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('legendary-armory.weapons.title'),
    description: t('legendary-armory.weapons.description'),
  };
}
