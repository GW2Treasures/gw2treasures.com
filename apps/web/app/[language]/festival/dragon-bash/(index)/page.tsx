import { Trans } from '@/components/I18n/Trans';
import { FestivalResource, FestivalResourceGrid } from '@/components/Festival/resource';
import { PageLayout } from '@/components/Layout/PageLayout';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import type { PageProps } from '@/lib/next';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import { absoluteUrl } from '@/lib/url';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Dashboard } from 'app/[language]/dashboard/dashboard';
import type { Event } from 'schema-dts';
import { Festival, getFestival } from '../../festivals';
import ogImage from '../og.png';
import { HologramStampedeTimer } from './hologram-stampede-timer';

import thumbnail100s from './thumbnail-100s.png';
import thumbnailGttp from './thumbnail-gttp.png';
import thumbnailWiki from './thumbnail-wiki.png';
import { createMetadata } from '@/lib/metadata';

const ITEM_COFFER = 43357;
const ITEM_ZHAITAFFY = 43319;
const ITEM_JORBREAKER = 43320;

const itemIds = [
  ITEM_COFFER,
  ITEM_ZHAITAFFY,
  ITEM_JORBREAKER,
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
}, ['dragon-bash-items'], { revalidate: 60 * 60 });

export default async function DragonBashFestivalPage({ params }: PageProps) {
  const { language } = await params;
  const t = getTranslate(language);
  const festival = getFestival(Festival.DragonBash);

  const { items } = await loadData();

  await pageView('festival/dragon-bash');

  return (
    <PageLayout>
      <p><Trans id="festival.dragon-bash.intro"/></p>
      <p><Trans id="festival.dragon-bash.description"/></p>

      <Headline id="hologram-stampede"><Trans id="festival.dragon-bash.hologram-stampede"/></Headline>
      <HologramStampedeTimer/>

      <Headline id="inventory">Account Dashboard</Headline>
      <p><Trans id="festival.dragon-bash.items.description"/></p>
      <Dashboard initialColumns={items.map((item) => ({ type: 'item', id: item.id, item }))} embedded/>

      <Headline id="resources">External Resources</Headline>
      <FestivalResourceGrid>
        <FestivalResource href="https://www.youtube.com/watch?v=3pj6UcM6yH4" imgSrc={thumbnail100s.src} type="YouTube">
          Dragon Bash in 100 Seconds
        </FestivalResource>
        <FestivalResource href="https://www.youtube.com/watch?v=RECavSpY0ic" imgSrc={thumbnailGttp.src} type="YouTube">
          Get To The Point: A Dragon Bash Festival Guide for Guild Wars 2
        </FestivalResource>
        <FestivalResource href="https://wiki.guildwars2.com/wiki/Dragon_Bash" imgSrc={thumbnailWiki.src} type="Wiki">
          Dragon Bash
        </FestivalResource>
      </FestivalResourceGrid>

      {festival && (
        <StructuredData data={{
          '@type': 'Event',
          name: t('festival.dragon-bash'),
          description: t('festival.dragon-bash.description'),
          location: {
            '@type': 'VirtualLocation',
            url: (await absoluteUrl('/festival/dragon-bash')).toString()
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

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: {
      absolute: `${t('festival.dragon-bash')} · gw2treasures.com`
    },
  };
});
