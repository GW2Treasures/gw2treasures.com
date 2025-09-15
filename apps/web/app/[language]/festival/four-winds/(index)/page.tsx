import { Trans } from '@/components/I18n/Trans';
import { FestivalResource, FestivalResourceGrid } from '@/components/Festival/resource';
import { PageLayout } from '@/components/Layout/PageLayout';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { cache } from '@/lib/cache';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import { absoluteUrl } from '@/lib/url';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Dashboard } from 'app/[language]/dashboard/dashboard';
import type { Event } from 'schema-dts';
import { Festival, getFestival } from '../../festivals';
import ogImage from '../og.png';

import thumbnail100s from './thumbnail-100s.png';
import thumbnailGttp from './thumbnail-gttp.png';
import thumbnailWiki from './thumbnail-wiki.png';
import { createMetadata } from '@/lib/metadata';
import type { Column } from 'app/[language]/dashboard/helper';

const CURRENCY_FESTIVAL_TOKEN = 50;
const ITEM_ZEPHYRITE_SUPPLY_BOX = 88145;
const ITEM_FAVOR_OF_THE_FESTIVAL = 66220;
const ITEM_FAVOR_OF_THE_BAZAAR = 88178;
const ITEM_FAVOR_OF_THE_PAVILLION = 88221;
const ITEM_GAUNTLET_TICKET = 44640;

const itemIds = [
  ITEM_ZEPHYRITE_SUPPLY_BOX,
  ITEM_FAVOR_OF_THE_FESTIVAL,
  ITEM_FAVOR_OF_THE_BAZAAR,
  ITEM_FAVOR_OF_THE_PAVILLION,
  ITEM_GAUNTLET_TICKET,
];

const loadData = cache(async function loadData() {
  const [items, currencies] = await Promise.all([
    db.item.findMany({
      where: { id: { in: itemIds }},
      select: {
        ...linkProperties,
        tpTradeable: true, tpCheckedAt: true,
        buyPrice: true, buyQuantity: true,
        sellPrice: true, sellQuantity: true,
        tpHistory: { orderBy: { time: 'asc' }}
      }
    }),
    db.currency.findMany({
      where: { id: CURRENCY_FESTIVAL_TOKEN },
      select: { ...linkPropertiesWithoutRarity }
    })
  ]);

  return {
    items: items.sort((a, b) => itemIds.indexOf(a.id) - itemIds.indexOf(b.id)),
    currencies
  };
}, ['four-winds-items'], { revalidate: 60 * 60 });

export default async function FourWindsFestivalPage() {
  const language = await getLanguage();
  const t = getTranslate(language);
  const festival = getFestival(Festival.FourWinds);

  const { items, currencies } = await loadData();

  await pageView('festival/four-winds');

  return (
    <PageLayout>
      <p><Trans id="festival.four-winds.intro"/></p>
      <p><Trans id="festival.four-winds.description"/></p>

      <Headline id="inventory">Account Dashboard</Headline>
      <p><Trans id="festival.four-winds.items.description"/></p>
      <Dashboard initialColumns={[
        ...currencies.map<Column>((currency) => ({ type: 'currency', id: currency.id, currency })),
        ...items.map<Column>((item) => ({ type: 'item', id: item.id, item })),
      ]} embedded/>

      <Headline id="resources">External Resources</Headline>
      <FestivalResourceGrid>
        <FestivalResource href="https://www.youtube.com/watch?v=gVfKCmTHLXc" imgSrc={thumbnail100s.src} type="YouTube">
          Festival of the Four Winds in 100 seconds
        </FestivalResource>
        <FestivalResource href="https://www.youtube.com/watch?v=yrtN305oPls" imgSrc={thumbnailGttp.src} type="YouTube">
          Get To The Point: A Festival of the Four Winds Guide
        </FestivalResource>
        <FestivalResource href="https://wiki.guildwars2.com/wiki/Festival_of_the_Four_Winds" imgSrc={thumbnailWiki.src} type="Wiki">
          Festival of the Four Winds
        </FestivalResource>
      </FestivalResourceGrid>

      {festival && (
        <StructuredData data={{
          '@type': 'Event',
          'name': t('festival.four-winds'),
          'description': t('festival.four-winds.description'),
          'location': {
            '@type': 'VirtualLocation',
            'url': (await absoluteUrl('/festival/four-winds')).toString()
          },
          'startDate': festival.startsAt.toISOString(),
          'endDate': festival.endsAt.toISOString(),
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
      absolute: `${t('festival.four-winds')} · gw2treasures.com`
    },
  };
});
