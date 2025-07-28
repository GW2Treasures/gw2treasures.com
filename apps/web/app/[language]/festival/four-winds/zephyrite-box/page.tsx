import { Badge } from '@/components/Badge/Badge';
import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { Coins } from '@/components/Format/Coins';
import { Fraction } from '@/components/Format/Fraction';
import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { OutputCount } from '@/components/Item/OutputCount';
import { globalColumnRenderer as itemTableColumn, renderPriceWithOptionalWarning } from '@/components/ItemTable/columns';
import { PageLayout } from '@/components/Layout/PageLayout';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { cache } from '@/lib/cache';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { createMetadata } from '@/lib/metadata';
import type { PageProps } from '@/lib/next';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import { groupById } from '@gw2treasures/helper/group-by';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';

type Offer = {
  quantity: number,
  cost: { quantity: number } & ({ itemId: number } | { currencyId: number }),
  weeklyLimit?: number,
};

const ITEM_ZEPHYRITE_SUPPLY_BOX = 88145;

const vendor: Offer[] = [
  { quantity: 1, cost: { quantity: 23, itemId: 19730 }}, // Coarse Leather Section
  { quantity: 1, cost: { quantity: 10, currencyId: 61 }}, // Research Note
  { quantity: 1, cost: { quantity: 8, currencyId: 61 }, weeklyLimit: 5 }, // Research Note
  { quantity: 1, cost: { quantity: 6, currencyId: 61 }, weeklyLimit: 3 }, // Research Note
  { quantity: 1, cost: { quantity: 8, itemId: 44941 }}, // Watchwork Sprocket
  { quantity: 1, cost: { quantity: 11, itemId: 19745 }}, // Gossamer Scrap
  { quantity: 1, cost: { quantity: 51, itemId: 19748 }}, // Silk Scrap
  { quantity: 1, cost: { quantity: 16, itemId: 19743 }}, // Linen Scrap
  { quantity: 1, cost: { quantity: 54, itemId: 19741 }}, // Cotton Scrap
  { quantity: 1, cost: { quantity: 14, itemId: 19739 }}, // Wool Scrap
  { quantity: 1, cost: { quantity: 34, itemId: 19718 }}, // Jute Scrap
  { quantity: 1, cost: { quantity: 3, itemId: 19732 }}, // Hardened Leather Section
  { quantity: 1, cost: { quantity: 24, itemId: 19729 }}, // Thick Leather Section
  { quantity: 1, cost: { quantity: 6, itemId: 19731 }}, // Rugged Leather Section
  { quantity: 1, cost: { quantity: 31, itemId: 19697 }}, // Copper Ore
  { quantity: 1, cost: { quantity: 40, itemId: 19728 }}, // Thin Leather Section
  { quantity: 1, cost: { quantity: 84, itemId: 19719 }}, // Rawhide Leather Section
  { quantity: 1, cost: { quantity: 6, itemId: 19725 }}, // Ancient Wood Log
  { quantity: 1, cost: { quantity: 22, itemId: 19722 }}, // Elder Wood Log
  { quantity: 1, cost: { quantity: 11, itemId: 19724 }}, // Hard Wood Log
  { quantity: 1, cost: { quantity: 13, itemId: 19727 }}, // Seasoned Wood Log
  { quantity: 1, cost: { quantity: 34, itemId: 19726 }}, // Soft Wood Log
  { quantity: 1, cost: { quantity: 71, itemId: 19723 }}, // Green Wood Log
  { quantity: 1, cost: { quantity: 8, itemId: 19701 }}, // Orichalcum Ore
  { quantity: 1, cost: { quantity: 16, itemId: 19700 }}, // Mithril Ore
  { quantity: 1, cost: { quantity: 6, itemId: 19702 }}, // Platinum Ore
  { quantity: 1, cost: { quantity: 23, itemId: 19698 }}, // Gold Ore
  { quantity: 1, cost: { quantity: 66, itemId: 19703 }}, // Silver Ore
  { quantity: 1, cost: { quantity: 10, itemId: 19699 }}, // Iron Ore
  { quantity: 2, cost: { quantity: 1, itemId: 24277 }}, // Pile of Crystalline Dust
  { quantity: 7, cost: { quantity: 2, itemId: 19721 }}, // Glob of Ectoplasm
];

const itemIds = [
  ITEM_ZEPHYRITE_SUPPLY_BOX,
  ...vendor.flatMap(({ cost }) => 'itemId' in cost ? [cost.itemId] : [])
];
const currencyIds = [
  ...vendor.flatMap(({ cost }) => 'currencyId' in cost ? [cost.currencyId] : [])
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
      },
    }),
    db.currency.findMany({
      where: { id: { in: currencyIds }},
      select: { ...linkPropertiesWithoutRarity }
    })
  ]);

  return { items, currencies };
}, ['four-winds-minis'], { revalidate: 60 * 5 });

type DbItem = Awaited<ReturnType<typeof loadData>>['items'][number];

const costQuantityStyle = {
  width: '2ch',
  fontFeatureSettings: '"tnum"',
  display: 'inline-block',
  textAlign: 'right'
} as const;


export default async function FourWindsAchievementsPage({ params }: PageProps) {
  const { language } = await params;
  const { items, currencies } = await loadData();
  await pageView('festival/four-winds/zephyrite-box');

  const itemsById = groupById(items);
  const currenciesById = groupById(currencies);

  const offers = vendor.map((offer) => ({
    ...offer,
    item: 'itemId' in offer.cost ? itemsById.get(offer.cost.itemId) : undefined,
    currency: 'currencyId' in offer.cost ? currenciesById.get(offer.cost.currencyId) : undefined,
  }));
  const vendorTable = createDataTable(offers, (_, i) => i);


  let cheapestBuy: number | undefined = undefined;
  let cheapestSell: number | undefined = undefined;

  for(const offer of offers) {
    if(!offer.item) {
      continue;
    }

    const buy = getCostPerUnit(offer.item.buyPrice, offer.quantity, offer.cost.quantity);
    const sell = getCostPerUnit(offer.item.sellPrice, offer.quantity, offer.cost.quantity);

    if(buy && (cheapestBuy === undefined || cheapestBuy > buy)) {
      cheapestBuy = buy;
    }
    if(sell && (cheapestSell === undefined || cheapestSell > sell)) {
      cheapestSell = sell;
    }
  }

  return (
    <PageLayout>
      <Headline id="vendor" actions={<ColumnSelect table={vendorTable}/>}><Trans id="festival.four-winds.zephyrite-box.vendor"/></Headline>
      <p><Trans id="festival.four-winds.zephyrite-box.vendor.description"/></p>
      <Notice>This table has not been updated to the 2025 prices yet!</Notice>

      <vendorTable.Table initialSortBy="buyPricePer" initialSortOrder="asc">
        <vendorTable.Column id="output" title="Output">
          {({ quantity, weeklyLimit }) => <FlexRow><OutputCount count={quantity}><ItemLink item={itemsById.get(ITEM_ZEPHYRITE_SUPPLY_BOX)!}/></OutputCount> {weeklyLimit && `(${weeklyLimit} per week)`}</FlexRow>}
        </vendorTable.Column>
        <vendorTable.Column id="cost" title="Cost">
          {({ cost, item, currency }) => <FlexRow><span style={costQuantityStyle}>{cost.quantity}</span> {item ? <ItemLink item={item}/> : <CurrencyLink currency={currency!}/>}</FlexRow>}
        </vendorTable.Column>

        <vendorTable.Column id="buyPrice" title={<Trans id="itemTable.column.buyPrice"/>} sortBy={({ item }) => item?.buyPrice} align="right" hidden>
          {({ item }) => item && itemTableColumn.buyPrice(item, {}, language)}
        </vendorTable.Column>
        <vendorTable.Column id="buyPriceTrend" title={<Trans id="itemTable.column.buyPriceTrend"/>} align="right">
          {({ item }) => item && itemTableColumn.buyPriceTrend(item, {}, language)}
        </vendorTable.Column>
        <vendorTable.Column id="buyQuantity" title={<Trans id="itemTable.column.buyQuantity"/>} sortBy={({ item }) => item?.buyQuantity} align="right" hidden>
          {({ item }) => item && itemTableColumn.buyQuantity(item, {}, language)}
        </vendorTable.Column>
        <vendorTable.Column
          id="buyPricePer"
          title={<Tip tip={<Trans id="festival.four-winds.zephyrite-box.buyPricePer.description"/>}><Trans id="festival.four-winds.zephyrite-box.buyPricePer"/></Tip>}
          sortBy={({ item, quantity, cost }) => getCostPerUnit(item?.buyPrice, quantity, cost.quantity) ?? Number.MAX_SAFE_INTEGER}
          align="right"
        >
          {({ item, quantity, cost }) => renderCostPerUnit(item, quantity, cost.quantity, item?.buyPrice, cheapestBuy)}
        </vendorTable.Column>
        <vendorTable.Column id="sellPrice" title={<Trans id="itemTable.column.sellPrice"/>} sortBy={({ item }) => item?.sellPrice} align="right" hidden>
          {({ item }) => item && itemTableColumn.sellPrice(item, {}, language)}
        </vendorTable.Column>
        <vendorTable.Column id="sellPriceTrend" title={<Trans id="itemTable.column.sellPriceTrend"/>} align="right">
          {({ item }) => item && itemTableColumn.sellPriceTrend(item, {}, language)}
        </vendorTable.Column>
        <vendorTable.Column id="sellQuantity" title={<Trans id="itemTable.column.sellQuantity"/>} sortBy={({ item }) => item?.sellQuantity} align="right" hidden>
          {({ item }) => item && itemTableColumn.sellQuantity(item, {}, language)}
        </vendorTable.Column>
        <vendorTable.Column
          id="sellPricePer"
          title={<Tip tip={<Trans id="festival.four-winds.zephyrite-box.sellPricePer.description"/>}><Trans id="festival.four-winds.zephyrite-box.sellPricePer"/></Tip>}
          sortBy={({ item, quantity, cost }) => getCostPerUnit(item?.sellPrice, quantity, cost.quantity) ?? Number.MAX_SAFE_INTEGER}
          align="right"
        >
          {({ item, quantity, cost }) => renderCostPerUnit(item, quantity, cost.quantity, item?.sellPrice, cheapestSell)}
        </vendorTable.Column>
      </vendorTable.Table>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('festival.four-winds.zephyrite-box'),
    description: t('festival.four-winds.zephyrite-box.vendor.description'),
    url: 'festival/four-winds/zephyrite-box',
  };
});

const getCostPerUnit = (price: number | null | undefined, outputCount: number, costQuantity: number) => price != null
  ? Math.round(price * costQuantity / outputCount)
  : null;

function renderCostPerUnit(item: DbItem | undefined, outputCount: number, costQuantity: number, itemPrice: number | undefined | null, cheapestPrice: number | undefined) {
  if(!item || !itemPrice) {
    return (
      <span style={{ color: 'var(--color-text-muted)' }}>
        -
      </span>
    );
  }

  const costPerUnit = getCostPerUnit(itemPrice, outputCount, costQuantity);
  const isCheapest = costPerUnit === cheapestPrice;

  return (
    <Tip tip={<><Fraction numerator="Cost Quantity" denominator="Output Count"/> &times; Price = <Fraction numerator={costQuantity} denominator={outputCount}/> &times; (<Coins value={itemPrice}/>)</>} preferredPlacement="top-end">
      <FlexRow align="right" inline>
        {isCheapest && <Badge>Cheapest</Badge>}
        <span style={{ fontWeight: isCheapest ? 500 : undefined }}>
          {renderPriceWithOptionalWarning(item.tpCheckedAt, costPerUnit)}
        </span>
      </FlexRow>
    </Tip>
  );
}
