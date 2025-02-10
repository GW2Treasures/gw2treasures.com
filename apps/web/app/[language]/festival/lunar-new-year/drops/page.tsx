import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { groupById } from '@gw2treasures/helper/group-by';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { globalColumnRenderer as itemTableColumn } from '@/components/ItemTable/columns';
import { PageLayout } from '@/components/Layout/PageLayout';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { Icon } from '@gw2treasures/ui';
import type { PageProps } from '@/lib/next';
import { translate, translateMany } from '@/lib/translate';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { Coins } from '@/components/Format/Coins';
import { DataTableFooterTd } from '@gw2treasures/ui/components/Table/DataTable.client';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Fraction } from '@/components/Format/Fraction';
import { Rarity } from '@/components/Item/Rarity';
import type { FC } from 'react';
import type { Language } from '@gw2treasures/database';
import { localizedName } from '@/lib/localizedName';
import { FormatDate } from '@/components/Format/FormatDate';
import type { Metadata } from 'next';
import { getAlternateUrls, getCurrentUrl } from '@/lib/url';
import ogImage from './drops-og.png';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';

type DrfData = { itemId: number, total: number, content: { id: number, count: number }[] }

const drfData: DrfData[] = [
  // divine lucky envelope
  { itemId: 68646, total: 1632, content: [
    { id: 45175, count: 4602 },
    { id: 104154, count: 1697 },
    { id: 45176, count: 1601 },
    { id: 77750, count: 896 },
    { id: 45177, count: 824 },
    { id: 77699, count: 394 },
    { id: 45178, count: 345 },
    { id: 77747, count: 242 },
    { id: 77686, count: 214 },
    { id: 68634, count: 210 },
    { id: 68636, count: 121 },
    { id: 68633, count: 117 },
    { id: 68632, count: 101 },
    { id: 68635, count: 99 },
    { id: 104164, count: 66 },
    { id: 68640, count: 42 },
    { id: 45179, count: 36 },
    { id: 90001, count: 23 },
    { id: 89999, count: 23 },
    { id: 104194, count: 21 },
    { id: 104167, count: 8 },
    { id: 104158, count: 3 },
  ]},

  // The Evon Gnashblade Lucky Envelope
  { itemId: 86946, total: 293, content: [
    { id: 45175, count: 1040 },
    { id: 104154, count: 302 },
    { id: 45176, count: 277 },
    { id: 77699, count: 182 },
    { id: 77750, count: 96 },
    { id: 45177, count: 94 },
    { id: 86945, count: 74 },
    { id: 86911, count: 73 },
    { id: 68634, count: 69 },
    { id: 86936, count: 62 },
    { id: 86942, count: 48 },
    { id: 45178, count: 48 },
    { id: 86934, count: 36 },
    { id: 77747, count: 24 },
    { id: 68636, count: 24 },
    { id: 77686, count: 14 },
    { id: 104164, count: 12 },
    { id: 68633, count: 11 },
    { id: 68632, count: 10 },
    { id: 68635, count: 9 },
    { id: 45179, count: 3 },
    { id: 68640, count: 3 },
    { id: 90001, count: 3 },
    { id: 104167, count: 2 },
    { id: 104194, count: 1 },
  ]},

  // Little Lucky Envelope
  { itemId: 68645, total: 4638, content: [
    { id: 45175, count: 2275 },
    { id: 77699, count: 1760 },
    { id: 68638, count: 1464 },
    { id: 68634, count: 905 },
    { id: 45176, count: 496 },
    { id: 77750, count: 430 },
    { id: 45177, count: 216 },
    { id: 77686, count: 56 },
    { id: 77747, count: 56 },
    { id: 68635, count: 51 },
    { id: 68633, count: 39 },
    { id: 68636, count: 34 },
    { id: 68632, count: 27 },
    { id: 45178, count: 23 },
    { id: 104194, count: 20 },
    { id: 104154, count: 10 },
    { id: 104158, count: 2 },
    { id: 90001, count: 1 },
  ]},

  // Lucky Red Bag
  { itemId: 94653, total: 65398, content: [
    { id: 68638, count: 71038 },
    { id: 68637, count: 1159 },
    { id: 104194, count: 603 },
    { id: 68635, count: 542 },
    { id: 77699, count: 540 },
    { id: 68633, count: 512 },
    { id: 68632, count: 482 },
    { id: 68636, count: 438 },
    { id: 68634, count: 248 },
    { id: 104158, count: 22 },
    { id: 104154, count: 7 },
  ]},
]

const loadItems = cache(async function loadItems(ids: number[]) {
  const items = await db.item.findMany({
    where: { id: { in: ids }},
    select: {
      ...linkProperties,
      vendorValue: true,
      tpTradeable: true, tpCheckedAt: true,
      buyPrice: true, buyQuantity: true,
      sellPrice: true, sellQuantity: true,
      tpHistory: { orderBy: { time: 'asc' }}
    },
    orderBy: { relevancy: 'desc' },
  });

  return items;
}, ['lunar-new-year/drops'], { revalidate: 60 });

function getAverage(item: Awaited<ReturnType<typeof loadItems>>[number], count: number, total: number) {
  const avg = total / count;

  return {
    avg,
    avgBuyPrice: item.buyPrice ? { value: item.buyPrice * avg, isVendor: false } : item.vendorValue ? { value: item.vendorValue * avg, isVendor: true } : undefined,
    avgSellPrice: item.sellPrice ? { value: item.sellPrice * avg, isVendor: false } : item.vendorValue ? { value: item.vendorValue * avg, isVendor: true } : undefined,
  };
}

export default async function LunarNewYearDropsPage({ params }: PageProps) {
  const { language } = await params;
  const items = await loadItems(drfData.flatMap((drf) => [drf.itemId, ...drf.content.map(({ id }) => id)]));
  const itemsById = groupById(items);

  return (
    <PageLayout toc>
      <Notice icon="eye">This is a preview based on a limited dataset including all MF.</Notice>
      <p>The drop data on this page is provided by <ExternalLink href="https://drf.rs/"><Icon icon="drf"/> DRF</ExternalLink> and only contains data between the start of Lunar New Year 2025 and <FormatDate date={new Date('2025-02-10T10:33:57.611Z')}/>.</p>
      {drfData.map((data) => (
        <DropTable data={data} itemsById={itemsById} language={language}/>
      ))}
    </PageLayout>
  )
}

const DropTable: FC<{ data: DrfData, itemsById: Map<number, Awaited<ReturnType<typeof loadItems>>[number]>, language: Language }> = async ({ data, itemsById, language }) => {
  const vendorValueTranslations = await translateMany(['item.flag.NoSell'], language);
  const drops = data.content.map((entry) => ({
    ...entry,
    item: itemsById.get(entry.id)!,
    ...getAverage(itemsById.get(entry.id)!, data.total, entry.count)
  }));

  const Items = createDataTable(drops, ({ id }) => id);

  const avgBuyPrice = drops.reduce((acc, cur) => acc + (cur.avgBuyPrice?.value ?? 0), 0);
  const avgBuyPriceInclTax = drops.reduce((acc, cur) => acc + (cur.avgBuyPrice ? cur.avgBuyPrice.isVendor ? cur.avgBuyPrice.value : cur.avgBuyPrice.value * 0.85 : 0), 0);
  const avgSellPrice = drops.reduce((acc, cur) => acc + (cur.avgSellPrice?.value ?? 0), 0);
  const avgSellPriceInclTax = drops.reduce((acc, cur) => acc + (cur.avgSellPrice ? cur.avgSellPrice.isVendor ? cur.avgSellPrice.value : cur.avgSellPrice.value * 0.85 : 0), 0);

  const item = itemsById.get(data.itemId)!;

  return (
    <>
      <Headline id={data.itemId.toString()} actions={<ColumnSelect table={Items}/>} tableOfContentLabel={localizedName(item, language)}><ItemLink item={item}/></Headline>
      <p>Based on <FormatNumber value={data.total}/> drops at 750% Magic Find.</p>
      <Items.Table initialSortBy="avgSellPrice" initialSortOrder="desc">
        <Items.Column id="item" title="Item" fixed>{({ item }) => <ItemLink item={item}/>}</Items.Column>
        <Items.Column id="rarity" title={<Trans id="itemTable.column.rarity"/>} sortBy={({ item }) => item.rarity} hidden>
          {({ item }) => <Rarity rarity={item.rarity}><Trans id={`rarity.${item.rarity}`}/></Rarity>}
        </Items.Column>
        <Items.Column id="avg" title="Avg. Droprate" align="right" sortBy="avg">
          {({ avg, count }) => <Tip tip={<><Fraction numerator="Total" denominator="Count"/> = <Fraction denominator={<FormatNumber value={count}/>} numerator={<FormatNumber value={data.total}/>}/></>}><FormatNumber value={avg}/></Tip>}
        </Items.Column>
        <Items.Column id="vendor" title={<Trans id="itemTable.column.vendorValue"/>} sortBy={({ item }) => item.vendorValue} align="right" hidden>
          {({ item }) => itemTableColumn.vendorValue(item, vendorValueTranslations)}
        </Items.Column>
        <Items.Column id="buyPrice" title={<Trans id="itemTable.column.buyPrice"/>} sortBy={({ item }) => item.buyPrice} align="right" hidden>
          {({ item }) => itemTableColumn.buyPrice(item, {})}
        </Items.Column>
        <Items.Column id="buyPriceTrend" title={<Trans id="itemTable.column.buyPriceTrend"/>} align="right" hidden>
          {({ item }) => itemTableColumn.buyPriceTrend(item, {})}
        </Items.Column>
        <Items.Column id="buyQuantity" title={<Trans id="itemTable.column.buyQuantity"/>} sortBy={({ item }) => item.buyQuantity} align="right" hidden>
          {({ item }) => itemTableColumn.buyQuantity(item, {})}
        </Items.Column>
        <Items.Column id="sellPrice" title={<Trans id="itemTable.column.sellPrice"/>} sortBy={({ item }) => item.sellPrice} align="right" hidden>
          {({ item }) => itemTableColumn.sellPrice(item, {})}
        </Items.Column>
        <Items.Column id="sellPriceTrend" title={<Trans id="itemTable.column.sellPriceTrend"/>} align="right" hidden>
          {({ item }) => itemTableColumn.sellPriceTrend(item, {})}
        </Items.Column>
        <Items.Column id="sellQuantity" title={<Trans id="itemTable.column.sellQuantity"/>} sortBy={({ item }) => item.sellQuantity} align="right" hidden>
          {({ item }) => itemTableColumn.sellQuantity(item, {})}
        </Items.Column>

        <Items.Column id="avgBuyPrice" title="Avg. Buy Price per" sortBy={({ avgBuyPrice }) => avgBuyPrice?.value} align="right" fixed>
          {({ avgBuyPrice }) => avgBuyPrice ? <>{avgBuyPrice.isVendor && (<Tip tip="Vendor Value used"><Icon icon="vendor" color="var(--color-text-muted)"/>&nbsp;</Tip>)}<Coins value={Math.ceil(avgBuyPrice.value)}/></> : empty}
        </Items.Column>
        <Items.Column id="avgSellPrice" title="Avg. Sell Price per" sortBy={({ avgSellPrice }) => avgSellPrice?.value} align="right" fixed>
          {({ avgSellPrice }) => avgSellPrice ? <>{avgSellPrice.isVendor && (<Tip tip="Vendor Value used"><Icon icon="vendor" color="var(--color-text-muted)"/>&nbsp;</Tip>)}<Coins value={Math.ceil(avgSellPrice.value)}/></> : empty}
        </Items.Column>
        <Items.Footer>
          <DataTableFooterTd colSpan={-2} align="right">Total Average (incl. Tax)</DataTableFooterTd>
          <td align="right"><Coins value={Math.ceil(avgBuyPriceInclTax)}/></td>
          <td align="right"><Coins value={Math.ceil(avgSellPriceInclTax)}/></td>
        </Items.Footer>
        <Items.Footer>
          <DataTableFooterTd colSpan={-2} align="right">Total Average (excl. Tax)</DataTableFooterTd>
          <td align="right"><Coins value={Math.ceil(avgBuyPrice)}/></td>
          <td align="right"><Coins value={Math.ceil(avgSellPrice)}/></td>
        </Items.Footer>
        {item.tpTradeable && (
          <Items.Footer>
            <DataTableFooterTd colSpan={-2} align="right">Trading Post (incl. Tax)</DataTableFooterTd>
            <td align="right">{item.buyPrice ? <Coins value={item.buyPrice}/> : empty}</td>
            <td align="right">{item.sellPrice ? <Coins value={item.sellPrice}/> : empty}</td>
          </Items.Footer>
        )}
        {item.tpTradeable && (
          <Items.Footer>
            <DataTableFooterTd colSpan={-2} align="right">Trading Post (excl. Tax)</DataTableFooterTd>
            <td align="right">{item.buyPrice ? <Coins value={Math.ceil(item.buyPrice * 0.85)}/> : empty}</td>
            <td align="right">{item.sellPrice ? <Coins value={Math.ceil(item.sellPrice * 0.85)}/> : empty}</td>
          </Items.Footer>
        )}
      </Items.Table>
    </>
  );
}

const empty = (
  <span style={{ color: 'var(--color-text-muted)' }}>-</span>
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: translate('festival.drops', language),
    description: 'Lunar New Year 2025 drop data',
    // make sure the efficiency query parameter is not part of the canonical URL, so only the default gets indexed by search engines
    alternates: getAlternateUrls('/festival/lunar-new-year/drops', language),
    openGraph: {
      images: [{ url: new URL(ogImage.src, await getCurrentUrl()), width: ogImage.width, height: ogImage.height }],
    },
    twitter: { card: 'summary_large_image' }
  };
}
