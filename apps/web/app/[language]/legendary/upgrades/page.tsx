import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import type { Metadata } from 'next';
import { createItemTable, LegendaryItemDataTable } from '../table';
import { pageView } from '@/lib/pageView';

const ignoredItems: number[] = [
  // 95093, // Legendary Equipment Unlocked!
];

const loadItems = cache(async () => {
  const items = await db.item.findMany({
    where: {
      type: { in: ['UpgradeComponent'] },
      legendaryArmoryMaxCount: { not: null },
      id: { notIn: ignoredItems },
    },
    select: {
      ...linkProperties,
      type: true, subtype: true,
      legendaryArmoryMaxCount: true
    },
    orderBy: { subtype: 'asc' }
  });

  return items;
}, ['legendary-upgrades'], { revalidate: 60 * 60 });

export default async function LegendaryUpgradesPage({ params }: PageProps) {
  const { language } = await params;

  await pageView('legendary/upgrades');

  const items = await loadItems();
  const Items = createItemTable(items);

  return (
    <>
      <Description actions={<ColumnSelect table={Items}/>}>
        <Trans id="legendary-armory.upgrades.description"/>
      </Description>
      <LegendaryItemDataTable language={language} table={Items}/>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('legendary-armory.upgrades.title'),
    description: t('legendary-armory.upgrades.description'),
  };
}
