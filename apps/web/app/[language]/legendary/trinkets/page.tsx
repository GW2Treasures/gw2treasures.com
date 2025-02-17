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

const loadItems = cache(async () => {
  const items = await db.item.findMany({
    where: { type: 'Trinket', legendaryArmoryMaxCount: { not: null }},
    select: {
      ...linkProperties,
      legendaryArmoryMaxCount: true
    }
  });

  return items;
}, ['legendary-trinkets'], { revalidate: 60 * 60 });

export default async function LegendaryRelicsPage() {
  const items = await loadItems();
  const Items = createItemTable(items);

  return (
    <>
      <Notice icon="eye" index={false}>This is a preview page and more features will be added in the future.</Notice>
      <Description actions={<ColumnSelect table={Items}/>}>
        <Trans id="legendary-armory.trinkets.description"/>
      </Description>
      <LegendaryItemDataTable table={Items}/>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('legendary-armory.trinkets.title'),
    description: t('legendary-armory.trinkets.description'),
  };
}
