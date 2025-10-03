import { FestivalResource, FestivalResourceGrid } from '@/components/Festival/resource';
import { Coins } from '@/components/Format/Coins';
import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { OutputCount } from '@/components/Item/OutputCount';
import { PriceTrend } from '@/components/Item/PriceTrend';
import { Code } from '@/components/Layout/Code';
import { PageLayout } from '@/components/Layout/PageLayout';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { CountDown } from '@/components/Time/countdown';
import { Waypoint } from '@/components/Waypoint/Waypoint';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { compareLocalizedName } from '@/lib/localizedName';
import { createMetadata } from '@/lib/metadata';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import { absoluteUrl } from '@/lib/url';
import { groupById } from '@gw2treasures/helper/group-by';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { Dashboard } from 'app/[language]/dashboard/dashboard';
import type { Column } from 'app/[language]/dashboard/helper';
import type { Event } from 'schema-dts';
import { Festival, getFestival } from '../../festivals';
import ogImage from '../og.png';

import thumbnail100s from './thumbnail-100s.png';
import thumbnailGttp from './thumbnail-gttp.png';
import thumbnailWiki from './thumbnail-wiki.png';

const ITEM_PIECE_OF_CANDY_CORN = 36041;
const ITEM_CANDY_CORN_COB = 47909;
const ITEM_TRICK_OR_TREAT_BAG = 36038;

const itemIds = [
  ITEM_PIECE_OF_CANDY_CORN,
  ITEM_CANDY_CORN_COB,
  ITEM_TRICK_OR_TREAT_BAG,
];

// event id: D92AF44A-647E-41CE-8E92-3E0CEE3AA38D
const madKingSaysEmotes = [
  'beckon',
  'bow',
  'cheer',
  'cower',
  'dance',
  'kneel',
  'laugh',
  'no',
  'point',
  'ponder',
  'salute',
  'shrug',
  'sit',
  'sleep',
  'surprised',
  'threaten',
  'wave',
  'yes',
] as const satisfies string[];
type MadKingEmote = typeof madKingSaysEmotes[number];

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

  return {
    items: items.sort((a, b) => itemIds.indexOf(a.id) - itemIds.indexOf(b.id)),
  };
}, ['halloween-items'], { revalidate: 60 * 60 });

export default async function HalloweenFestivalPage() {
  const language = await getLanguage();
  const t = getTranslate(language);
  const festival = getFestival(Festival.Halloween);

  const { items } = await loadData();

  await pageView('festival/halloween');

  const itemsById = groupById(items);
  const candyCorn = itemsById.get(ITEM_PIECE_OF_CANDY_CORN)!;
  const candyCob = itemsById.get(ITEM_CANDY_CORN_COB)!;

  const conversions: { item: typeof items[number], quantity?: number, type: 'buy' | 'sell' }[] = [
    { item: candyCob, type: 'buy' },
    { item: candyCob, type: 'sell' },
    { item: candyCorn, quantity: 1000, type: 'buy' },
    { item: candyCorn, quantity: 1000, type: 'sell' },
  ];

  const candyCornConversion = createDataTable(conversions, (_, i) => i);
  const madKingSays = createDataTable(madKingSaysEmotes, (emote) => emote);

  return (
    <PageLayout>
      <p style={{ borderLeft: '4px solid var(--color-border-dark)', paddingLeft: 16 }}><Trans id="festival.halloween.intro"/></p>
      <p><Trans id="festival.halloween.description"/></p>

      <Headline id="conversion" actions={<ColumnSelect table={candyCornConversion}/>}><Trans id="festival.halloween.conversion"/></Headline>
      <p><Trans id="festival.halloween.conversion.description"/></p>
      <candyCornConversion.Table initialSortBy="price">
        <candyCornConversion.Column id="item" title={<Trans id="itemTable.column.item"/>} sort={(a, b) => compareLocalizedName(language)(a.item, b.item)}>{({ item, quantity }) => <OutputCount count={quantity ?? 1}><ItemLink item={item}/></OutputCount>}</candyCornConversion.Column>
        <candyCornConversion.Column id="type" title={<Trans id="itemTable.column.type"/>} sortBy="type">{({ type }) => type === 'buy' ? <Trans id="itemTable.column.buyPrice"/> : <Trans id="itemTable.column.sellPrice"/>}</candyCornConversion.Column>
        <candyCornConversion.Column id="price" title={<Trans id="festival.halloween.conversion.price"/>} align="right" sortBy={(({ item, quantity, type }) => item[`${type}Price`]! * (quantity ?? 1))}>{({ item, quantity, type }) => <Coins value={item[`${type}Price`]! * (quantity ?? 1)} long/>}</candyCornConversion.Column>
        <candyCornConversion.Column id="trend" title={<Trans id="festival.halloween.conversion.priceTrend"/>} align="right">{({ item, type }) => <PriceTrend history={item.tpHistory} price={`${type}Price`}/>}</candyCornConversion.Column>
      </candyCornConversion.Table>

      <Headline id="inventory">Account Dashboard</Headline>
      <p><Trans id="festival.halloween.items.description"/></p>
      <Dashboard initialColumns={[
        ...items.map<Column>((item) => ({ type: 'item', id: item.id, item })),
      ]} embedded/>

      <Headline id="mad-king" actions={[
        <span key="countdown"><Trans id="festival.halloween.mad-king-says.countdown"/> <CountDown schedule={{ offset: 0, repeat: 120 }} active={<Trans id="incursive-investigation.active"/>} activeDurationMinutes={10}/></span>,
        <Waypoint key="waypoint" id={1040} title={<Trans id="festival.halloween.mad-king-says.waypoint"/>} appearance="secondary"/>
      ]}
      >
        <Trans id="festival.halloween.mad-king-says"/>
      </Headline>
      <p><Trans id="festival.halloween.mad-king-says.description"/></p>

      <madKingSays.Table initialSortBy="says" initialSortOrder="asc">
        <madKingSays.Column id="says" title={<Trans id="festival.halloween.mad-king-says"/>} sortBy={(emote: MadKingEmote) => t(`festival.halloween.mad-king-says.emote.${emote}`)}>
          {(emote) => <Trans id={`festival.halloween.mad-king-says.emote.${emote}`}/>}
        </madKingSays.Column>
        <madKingSays.Column id="emote" title={<Trans id="festival.halloween.mad-king-says.emote"/>}>
          {(emote) => <FlexRow><CopyButton copy={`/${emote}`} icon="copy" iconOnly/> <Code inline borderless>{`/${emote}`}</Code></FlexRow>}
        </madKingSays.Column>
      </madKingSays.Table>

      <Headline id="resources">External Resources</Headline>
      <FestivalResourceGrid>
        <FestivalResource href="https://www.youtube.com/watch?v=R_5OzN1el-Y" imgSrc={thumbnail100s.src} type="YouTube">
          Shadow of the Mad King in 100 seconds
        </FestivalResource>
        <FestivalResource href="https://www.youtube.com/watch?v=ZrIdEtuNDUw" imgSrc={thumbnailGttp.src} type="YouTube">
          Get To The Point: The Shadow of the Mad King Guide
        </FestivalResource>
        <FestivalResource href="https://wiki.guildwars2.com/wiki/Halloween" imgSrc={thumbnailWiki.src} type="Wiki">
          Halloween
        </FestivalResource>
      </FestivalResourceGrid>

      {festival && (
        <StructuredData data={{
          '@type': 'Event',
          'name': t('festival.halloween'),
          'description': t('festival.halloween.description'),
          'location': {
            '@type': 'VirtualLocation',
            'url': (await absoluteUrl('/festival/halloween')).toString()
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
      absolute: `${t('festival.halloween')} · gw2treasures.com`
    },
  };
});
