import { Trans } from '@/components/I18n/Trans';
import { PageLayout } from '@/components/Layout/PageLayout';
import { pageView } from '@/lib/pageView';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { Metadata } from 'next';
import { db } from '@/lib/prisma';
import { linkProperties } from '@/lib/linkProperties';
import { cache } from '@/lib/cache';
import type { PageProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { Dashboard } from 'app/[language]/dashboard/dashboard';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import type { Event } from 'schema-dts';
import { absoluteUrl, getAlternateUrls } from '@/lib/url';
import { Festival, getFestival } from '../../festivals';
import ogImage from '../og.png';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';

const ITEM_BAUBLE = 39752;
const ITEM_BAUBLE_BUBBLE = 41886;
const ITEM_CONTINUE_COIN = 41824;
const ITEM_CRIMSON_ASSASSIN_TOKEN = 80890;
const ITEM_FANCY_FURNITURE_COIN = 78062;

const itemIds = [
  ITEM_BAUBLE,
  ITEM_BAUBLE_BUBBLE,
  ITEM_CONTINUE_COIN,
  ITEM_CRIMSON_ASSASSIN_TOKEN,
  ITEM_FANCY_FURNITURE_COIN,
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

  return { items: items.sort((a, b) => itemIds.indexOf(a.id) - itemIds.indexOf(b.id)) };
}, ['super-adventure-box-items'], { revalidate: 60 * 60 });

export default async function SuperAdventureFestivalPage({ params }: PageProps) {
  const { language } = await params;
  const t = getTranslate(language);
  const festival = getFestival(Festival.SuperAdventureFestival);

  const { items } = await loadData();

  await pageView('festival/super-adventure');

  return (
    <PageLayout>
      <p>
        <Trans id="festival.super-adventure.intro"/>{' '}
        If this is your first time participating or you just want a quick refresh, check out the YouTube video <ExternalLink href="https://www.youtube.com/watch?v=1SqenoV1vg8">Get To The Point: A Super Adventure Box Festival Guide for Guild Wars 2</ExternalLink> or read up on it on the <ExternalLink href="https://wiki.guildwars2.com/wiki/Super_Adventure_Festival">official Guild Wars 2 Wiki</ExternalLink>.
      </p>
      <p><Trans id="festival.super-adventure.description"/></p>

      <Headline id="inventory">Account Dashboard</Headline>
      <p><Trans id="festival.super-adventure.items.description"/></p>
      <Dashboard initialColumns={items.map((item) => ({ type: 'item', id: item.id, item }))} embedded/>

      {festival && (
        <StructuredData data={{
          '@type': 'Event',
          name: t('festival.super-adventure'),
          description: t('festival.super-adventure.description'),
          location: {
            '@type': 'VirtualLocation',
            url: (await absoluteUrl('/festival/super-adventure')).toString()
          },
          startDate: festival.startsAt.toISOString(),
          endDate: festival.endsAt.toISOString(),
          eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
          image: [(await absoluteUrl(ogImage.src)).toString()]
        } satisfies Event}/>
      )}
    </PageLayout>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: {
      absolute: `${t('festival.super-adventure')} · gw2treasures.com`
    },
    alternates: getAlternateUrls('festival/super-adventure', language),
  };
}
