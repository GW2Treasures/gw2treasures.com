import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { ItemInventoryTable } from '@/components/Item/ItemInventoryTable';
import { ItemTable } from '@/components/ItemTable/ItemTable';
import { ItemTableColumnsButton } from '@/components/ItemTable/ItemTableColumnsButton';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { PageLayout } from '@/components/Layout/PageLayout';
import { pageView } from '@/lib/pageView';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { Metadata } from 'next';
import { requiredScopes } from '../helper';
import { db } from '@/lib/prisma';
import { linkProperties } from '@/lib/linkProperties';
import { cache } from '@/lib/cache';
import { ItemLink } from '@/components/Item/ItemLink';
import type { PageProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { Fragment } from 'react';

const itemIds = [
  86601,
  86627,
  77604,
];

const loadData = cache(async function loadData() {
  const [items] = await Promise.all([
    db.item.findMany({
      where: { id: { in: itemIds }},
      select: linkProperties
    })
  ]);

  return { items };
}, ['wintersday-items'], { revalidate: 60 * 60 });


export default async function WintersdayPage() {
  const { items } = await loadData();
  await pageView('festival/wintersday');

  return (
    <PageLayout>
      <ItemTableContext id="wintersday">
        <p><Trans id="festival.wintersday.intro"/></p>
        <p><Trans id="festival.wintersday.description"/></p>
        <Headline actions={<ItemTableColumnsButton/>} id="items"><Trans id="navigation.items"/></Headline>
        <ItemTable query={{ where: { id: { in: itemIds }}}} defaultColumns={['item', 'rarity', 'type', 'buyPrice', 'buyPriceTrend', 'sellPrice', 'sellPriceTrend']}/>
      </ItemTableContext>

      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.wintersday.items.login"/>} authorizationMessage={<Trans id="festival.wintersday.items.authorize"/>}>
        {items.map((item) => (
          <Fragment key={item.id}>
            <Headline id={item.id.toString()}><ItemLink item={item}/></Headline>
            <ItemInventoryTable itemId={item.id}/>
          </Fragment>
        ))}
      </Gw2Accounts>

    </PageLayout>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: {
      absolute: `${t('festival.wintersday')} · gw2treasures.com`
    }
  };
}
