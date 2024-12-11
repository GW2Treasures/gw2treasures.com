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
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { OutputCount } from '@/components/Item/OutputCount';
import { groupById } from '@gw2treasures/helper/group-by';
import { Coins } from '@/components/Format/Coins';
import { PriceTrend } from '@/components/Item/PriceTrend';
import { compareLocalizedName } from '@/lib/localizedName';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { FormatNumber } from '@/components/Format/FormatNumber';

const ITEM_SNOWFLAKE_ID = 86601;
const ITEM_SNOW_DIAMOND_ID = 86627;
const ITEM_WINTERSDAY_GIFT_ID = 77604;

const itemIds = [
  ITEM_SNOWFLAKE_ID,
  ITEM_SNOW_DIAMOND_ID,
  ITEM_WINTERSDAY_GIFT_ID,
];

const loadData = cache(async function loadData() {
  const [items] = await Promise.all([
    db.item.findMany({
      where: { id: { in: itemIds }},
      select: {
        ...linkProperties,
        tpTradeable: true, tpCheckedAt: true,
        buyPrice: true, buyQuantity: true,
        sellPrice: true, sellQuantity: true,
        tpHistory: { orderBy: { time: 'asc' }}
      }
    })
  ]);

  return { items };
}, ['wintersday-items'], { revalidate: 60 * 60 });

export default async function WintersdayPage({ params }: PageProps) {
  const { language } = await params;
  const { items } = await loadData();
  await pageView('festival/wintersday');

  const itemsById = groupById(items);
  const snowflake = itemsById.get(ITEM_SNOWFLAKE_ID)!;
  const snowDiamond = itemsById.get(ITEM_SNOW_DIAMOND_ID)!;

  const conversions: { item: typeof items[number], quantity?: number, type: 'buy' | 'sell' }[] = [
    { item: snowDiamond, type: 'buy' },
    { item: snowDiamond, type: 'sell' },
    { item: snowflake, quantity: 1000, type: 'buy' },
    { item: snowflake, quantity: 1000, type: 'sell' },
  ];

  const SnowDiamondConversions = createDataTable(conversions, (_, i) => i);

  return (
    <PageLayout>
      <ItemTableContext id="wintersday">
        <p><Trans id="festival.wintersday.intro"/></p>
        <p><Trans id="festival.wintersday.description"/></p>
        <Headline actions={<ItemTableColumnsButton/>} id="items"><Trans id="navigation.items"/></Headline>
        <ItemTable query={{ where: { id: { in: itemIds }}}} defaultColumns={['item', 'rarity', 'type', 'buyPrice', 'buyPriceTrend', 'sellPrice', 'sellPriceTrend']}/>
      </ItemTableContext>

      <Headline id="conversion" actions={<ColumnSelect table={SnowDiamondConversions}/>}>Snow Diamond Conversion</Headline>
      <p><FormatNumber value={1000}/> Snowflakes can be exchanged for 1 Snow Diamond at the &quot;Charity Corps Seraph&quot; vendor in Divinity&apos;s Reach.</p>
      <SnowDiamondConversions.Table initialSortBy="price">
        <SnowDiamondConversions.Column id="item" title="Item" sort={(a, b) => compareLocalizedName(language)(a.item, b.item)}>{({ item, quantity }) => <OutputCount count={quantity ?? 1}><ItemLink item={item}/></OutputCount>}</SnowDiamondConversions.Column>
        <SnowDiamondConversions.Column id="type" title="Type" sortBy="type">{({ type }) => type === 'buy' ? 'Buy Price' : 'Sell Price'}</SnowDiamondConversions.Column>
        <SnowDiamondConversions.Column id="price" title="Price" align="right" sortBy={(({ item, quantity, type }) => item[`${type}Price`]! * (quantity ?? 1))}>{({ item, quantity, type }) => <Coins value={item[`${type}Price`]! * (quantity ?? 1)}/>}</SnowDiamondConversions.Column>
        <SnowDiamondConversions.Column id="trend" title="Price Trend (7d)" align="right">{({ item, type }) => <PriceTrend history={item.tpHistory} price={`${type}Price`}/>}</SnowDiamondConversions.Column>
      </SnowDiamondConversions.Table>

      <div style={{ marginTop: 32 }}/>

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
