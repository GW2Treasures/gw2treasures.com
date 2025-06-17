/* eslint-disable @next/next/no-img-element */
import { Trans } from '@/components/I18n/Trans';
import { PageLayout } from '@/components/Layout/PageLayout';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import type { PageProps } from '@/lib/next';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import { absoluteUrl, getAlternateUrls } from '@/lib/url';
import { Icon } from '@gw2treasures/ui';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Dashboard } from 'app/[language]/dashboard/dashboard';
import type { Metadata } from 'next';
import type { Event } from 'schema-dts';
import { Festival, getFestival } from '../../festivals';
import ogImage from '../og.png';
import { HologramStampedeTimer } from './hologram-stampede-timer';
import styles from './page.module.css';

import thumbnail100s from './thumbnail-100s.png';
import thumbnailGttp from './thumbnail-gttp.png';
import thumbnailWiki from './thumbnail-wiki.png';

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
      <div className={styles.cards}>
        <a href="https://www.youtube.com/watch?v=3pj6UcM6yH4" rel="noreferrer noopener" target="_blank" className={styles.linkCardYoutube}>
          <img src={thumbnail100s.src} alt="" width={128}/>
          <span className={styles.linkCardType}>Youtube <Icon icon="external-link"/></span>
          <span className={styles.linkCardTitle}>Dragon Bash in 100 Seconds</span>
        </a>

        <a href="https://www.youtube.com/watch?v=RECavSpY0ic" rel="noreferrer noopener" target="_blank" className={styles.linkCardYoutube}>
          <img src={thumbnailGttp.src} alt="" width={128}/>
          <span className={styles.linkCardType}>Youtube <Icon icon="external-link"/></span>
          <span className={styles.linkCardTitle}>Get To The Point: A Dragon Bash Festival Guide for Guild Wars 2</span>
        </a>

        <a href="https://wiki.guildwars2.com/wiki/Dragon_Bash" rel="noreferrer noopener" target="_blank" className={styles.linkCard}>
          <img src={thumbnailWiki.src} alt="" width={128}/>
          <span className={styles.linkCardType}>Wiki <Icon icon="external-link"/></span>
          <span className={styles.linkCardTitle}>Dragon Bash</span>
        </a>
      </div>

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: {
      absolute: `${t('festival.dragon-bash')} · gw2treasures.com`
    },
    alternates: getAlternateUrls('festival/dragon-bash', language),
  };
}
