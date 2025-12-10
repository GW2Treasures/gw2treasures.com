import { Coins } from '@/components/Format/Coins';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { OutputCount } from '@/components/Item/OutputCount';
import { PriceTrend } from '@/components/Item/PriceTrend';
import { PageLayout } from '@/components/Layout/PageLayout';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { compareLocalizedName } from '@/lib/localizedName';
import { createMetadata } from '@/lib/metadata';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import { absoluteUrl } from '@/lib/url';
import { groupById } from '@gw2treasures/helper/group-by';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { Dashboard } from 'app/[language]/dashboard/dashboard';
import type { Column } from 'app/[language]/dashboard/helper';
import type { Event } from 'schema-dts';
import { Festival, getFestival } from '../../festivals';
import ogImage from '../og.png';

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

export default async function WintersdayPage() {
  const wintersday = getFestival(Festival.Wintersday);

  const language = await getLanguage();
  const t = getTranslate(language);

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
      <p style={{ borderLeft: '4px solid var(--color-border-dark)', paddingLeft: 16 }}><Trans id="festival.wintersday.intro"/></p>
      <p><Trans id="festival.wintersday.description"/></p>

      <Headline id="conversion" actions={<ColumnSelect table={SnowDiamondConversions}/>}><Trans id="festival.wintersday.conversion"/></Headline>
      <p><FormatNumber value={1000}/> Snowflakes can be exchanged for 1 Snow Diamond at the &quot;Charity Corps Seraph&quot; vendor in Divinity&apos;s Reach.</p>
      <SnowDiamondConversions.Table initialSortBy="price">
        <SnowDiamondConversions.Column id="item" title={<Trans id="itemTable.column.item"/>} sort={(a, b) => compareLocalizedName(language)(a.item, b.item)}>{({ item, quantity }) => <OutputCount count={quantity ?? 1}><ItemLink item={item}/></OutputCount>}</SnowDiamondConversions.Column>
        <SnowDiamondConversions.Column id="type" title={<Trans id="itemTable.column.type"/>} sortBy="type">{({ type }) => type === 'buy' ? <Trans id="itemTable.column.buyPrice"/> : <Trans id="itemTable.column.sellPrice"/>}</SnowDiamondConversions.Column>
        <SnowDiamondConversions.Column id="price" title={<Trans id="festival.halloween.conversion.price"/>} align="right" sortBy={(({ item, quantity, type }) => item[`${type}Price`]! * (quantity ?? 1))}>{({ item, quantity, type }) => <Coins value={item[`${type}Price`]! * (quantity ?? 1)} long/>}</SnowDiamondConversions.Column>
        <SnowDiamondConversions.Column id="trend" title={<Trans id="festival.halloween.conversion.priceTrend"/>} align="right">{({ item, type }) => <PriceTrend history={item.tpHistory} price={`${type}Price`}/>}</SnowDiamondConversions.Column>
      </SnowDiamondConversions.Table>

      <Headline id="inventory">Account Dashboard</Headline>
      <p><Trans id="festival.wintersday.items.description"/></p>
      <Dashboard initialColumns={[
        ...items.map<Column>((item) => ({ type: 'item', id: item.id, item })),
      ]} embedded/>


      {wintersday && (
        <StructuredData data={{
          '@type': 'Event',
          'name': t('festival.wintersday'),
          'description': t('festival.wintersday.description'),
          'location': {
            '@type': 'VirtualLocation',
            'url': (await absoluteUrl('/festival/wintersday')).toString()
          },
          'startDate': wintersday.startsAt.toISOString(),
          'endDate': wintersday.endsAt.toISOString(),
          'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode',
          'image': [(await absoluteUrl(ogImage.src)).toString()]
        } satisfies Event}/>
      )}

    </PageLayout>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: {
      absolute: `${t('festival.wintersday')} · gw2treasures.com`
    },
  };
});
