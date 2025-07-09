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
import { getTranslate, translateMany } from '@/lib/translate';
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
import ogImage from './drops-og.png';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { pageView } from '@/lib/pageView';
import styles from './page.module.css';
import { data as drfData, type DrfData } from './data';
import { MathIf } from '@/components/Format/math/if';
import { createMetadata } from '@/lib/metadata';

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
  await pageView('festival/lunar-new-year/drops');
  const items = await loadItems(drfData.flatMap((drf) => [drf.itemId, ...drf.content.map(({ id }) => id)]));
  const itemsById = groupById(items);

  return (
    <PageLayout toc>
      <Notice icon="eye">This is a preview based on a limited dataset including all MF.</Notice>
      <p>The drop data on this page is provided by <ExternalLink href="https://drf.rs/"><Icon icon={drfLogo} className={styles.drf}/>DRF</ExternalLink> and only contains data between the start of Lunar New Year 2025 and <FormatDate date={new Date('2025-02-10T10:33:57.611Z')}/>.</p>
      {drfData.map((data) => (
        <DropTable key={data.itemId} data={data} itemsById={itemsById} language={language}/>
      ))}
    </PageLayout>
  );
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
  const avgBuyPriceAfterTax = drops.reduce((acc, cur) => acc + (cur.avgBuyPrice ? cur.avgBuyPrice.isVendor ? cur.avgBuyPrice.value : cur.avgBuyPrice.value * 0.85 : 0), 0);
  const avgSellPrice = drops.reduce((acc, cur) => acc + (cur.avgSellPrice?.value ?? 0), 0);
  const avgSellPriceAfterTax = drops.reduce((acc, cur) => acc + (cur.avgSellPrice ? cur.avgSellPrice.isVendor ? cur.avgSellPrice.value : cur.avgSellPrice.value * 0.85 : 0), 0);

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
        <Items.Column id="avg" title="Avg. Drop Rate" align="right" sortBy="avg">
          {({ avg, count }) => (
            <Tip tip={<><Fraction numerator="Total" denominator="Count"/> = <Fraction denominator={<FormatNumber value={count}/>} numerator={<FormatNumber value={data.total}/>}/></>}>
              <FormatNumber value={avg} approx/>
            </Tip>
          )}
        </Items.Column>
        <Items.Column id="vendor" title={<Trans id="itemTable.column.vendorValue"/>} sortBy={({ item }) => item.vendorValue} align="right" hidden>
          {({ item }) => itemTableColumn.vendorValue(item, vendorValueTranslations, language)}
        </Items.Column>
        <Items.Column id="buyPrice" title={<Trans id="itemTable.column.buyPrice"/>} sortBy={({ item }) => item.buyPrice} align="right" hidden>
          {({ item }) => itemTableColumn.buyPrice(item, {}, language)}
        </Items.Column>
        <Items.Column id="buyPriceTrend" title={<Trans id="itemTable.column.buyPriceTrend"/>} align="right" hidden>
          {({ item }) => itemTableColumn.buyPriceTrend(item, {}, language)}
        </Items.Column>
        <Items.Column id="buyQuantity" title={<Trans id="itemTable.column.buyQuantity"/>} sortBy={({ item }) => item.buyQuantity} align="right" hidden>
          {({ item }) => itemTableColumn.buyQuantity(item, {}, language)}
        </Items.Column>
        <Items.Column id="sellPrice" title={<Trans id="itemTable.column.sellPrice"/>} sortBy={({ item }) => item.sellPrice} align="right" hidden>
          {({ item }) => itemTableColumn.sellPrice(item, {}, language)}
        </Items.Column>
        <Items.Column id="sellPriceTrend" title={<Trans id="itemTable.column.sellPriceTrend"/>} align="right" hidden>
          {({ item }) => itemTableColumn.sellPriceTrend(item, {}, language)}
        </Items.Column>
        <Items.Column id="sellQuantity" title={<Trans id="itemTable.column.sellQuantity"/>} sortBy={({ item }) => item.sellQuantity} align="right" hidden>
          {({ item }) => itemTableColumn.sellQuantity(item, {}, language)}
        </Items.Column>

        <Items.Column id="avgBuyPrice" title="Avg. Buy Price per" sortBy={({ avgBuyPrice }) => avgBuyPrice?.value} align="right" fixed>
          {({ avgBuyPrice, avg, item }) => avgBuyPrice ? (
            <>
              {avgBuyPrice.isVendor && (<Tip tip="Vendor Value used"><Icon icon="vendor" color="var(--color-text-muted)"/>&nbsp;</Tip>)}
              <Tip tip={<div style={{ lineHeight: 1.5, textAlign: 'right' }}>Avg. Drop Rate &times; {avgBuyPrice.isVendor ? 'Vendor Value' : 'Buy Price'}<br/>= <FormatNumber value={avg} approx/> &times; <Coins value={avgBuyPrice.isVendor ? item.vendorValue! : item.buyPrice!}/></div>}>
                <Coins value={Math.ceil(avgBuyPrice.value)}/>
              </Tip>
            </>
          ) : empty}
        </Items.Column>
        <Items.Column id="avgSellPrice" title="Avg. Sell Price per" sortBy={({ avgSellPrice }) => avgSellPrice?.value} align="right" fixed>
          {({ avgSellPrice, avg, item }) => avgSellPrice ? (
            <>
              {avgSellPrice.isVendor && (<Tip tip="Vendor Value used"><Icon icon="vendor" color="var(--color-text-muted)"/>&nbsp;</Tip>)}
              <Tip tip={<div style={{ lineHeight: 1.5, textAlign: 'right' }}>Avg. Drop Rate &times; {avgSellPrice.isVendor ? 'Vendor Value' : 'Sell Price'}<br/>= <FormatNumber value={avg} approx/> &times; <Coins value={avgSellPrice.isVendor ? item.vendorValue! : item.sellPrice!}/></div>}>
                <Coins value={Math.ceil(avgSellPrice.value)}/>
              </Tip>
            </>
          ) : empty}
        </Items.Column>
        <Items.Footer>
          <DataTableFooterTd colSpan={-2} align="right">Total Average (after Tax)</DataTableFooterTd>
          <td align="right"><Tip tip={<>∑<MathIf a="Avg. Buy Price per × 0.85" aCondition="if tradable" b="Vendor Value" bCondition="otherwise"/></>}><Coins value={Math.ceil(avgBuyPriceAfterTax)}/></Tip></td>
          <td align="right"><Tip tip={<>∑<MathIf a="Avg. Sell Price per × 0.85" aCondition="if tradable" b="Vendor Value" bCondition="otherwise"/></>}><Coins value={Math.ceil(avgSellPriceAfterTax)}/></Tip></td>
        </Items.Footer>
        <Items.Footer>
          <DataTableFooterTd colSpan={-2} align="right">Total Average (before Tax)</DataTableFooterTd>
          <td align="right"><Tip tip="∑ Avg. Buy Price per"><Coins value={Math.ceil(avgBuyPrice)}/></Tip></td>
          <td align="right"><Tip tip="∑ Avg. Sell Price per"><Coins value={Math.ceil(avgSellPrice)}/></Tip></td>
        </Items.Footer>
        {item.tpTradeable && (
          <Items.Footer>
            <DataTableFooterTd colSpan={-2} align="right">{localizedName(item, language)} (after Tax)</DataTableFooterTd>
            <td align="right"><Tip tip="Buy Price × 0.85">{item.buyPrice ? <Coins value={Math.ceil(item.buyPrice * 0.85)}/> : empty}</Tip></td>
            <td align="right"><Tip tip="Sell Price × 0.85">{item.sellPrice ? <Coins value={Math.ceil(item.sellPrice * 0.85)}/> : empty}</Tip></td>
          </Items.Footer>
        )}
        {item.tpTradeable && (
          <Items.Footer>
            <DataTableFooterTd colSpan={-2} align="right">{localizedName(item, language)} (before Tax)</DataTableFooterTd>
            <td align="right"><Tip tip="Buy Price">{item.buyPrice ? <Coins value={item.buyPrice}/> : empty}</Tip></td>
            <td align="right"><Tip tip="Sell Price">{item.sellPrice ? <Coins value={item.sellPrice}/> : empty}</Tip></td>
          </Items.Footer>
        )}
      </Items.Table>
    </>
  );
};

const empty = (
  <span style={{ color: 'var(--color-text-muted)' }}>-</span>
);

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('festival.drops'),
    description: 'Lunar New Year 2025 drop data',
    url: '/festival/lunar-new-year/drops',
    image: ogImage,
    robots: { index: false },
  };
});


const drfLogo = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 392 488" stroke="currentColor">
    <path d="M379.5 292c0 101.3-82.2 183.5-183.5 183.5S12.5 393.3 12.5 292c0-42.6 13.77-82.29 38.9-112.7C86.55 136.75 196 12.5 196 12.5s109.45 124.25 144.6 166.8c25.13 30.41 38.9 70.1 38.9 112.7z" fill="none" strokeLinejoin="round" strokeWidth="25"/>
    <path fill="currentColor" d="M354.17 293.05a158.17 158.17 0 0 1-316.34 0s74-84.19 158.17 0 158.17 0 158.17 0z"/>
    <circle fill="currentColor" cx="223.83" cy="265.67" r="21.67"/>
    <circle fill="currentColor" cx="231.33" cy="157.67" r="35.33"/>
    <circle fill="currentColor" cx="135.42" cy="200.33" r="25.17"/>
  </svg>
);
