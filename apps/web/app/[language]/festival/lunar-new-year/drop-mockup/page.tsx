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
import { translateMany } from '@/lib/translate';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { Coins } from '@/components/Format/Coins';
import { DataTableFooterTd } from '@gw2treasures/ui/components/Table/DataTable.client';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Fraction } from '@/components/Format/Fraction';
import { Rarity } from '@/components/Item/Rarity';

const drf = {
  itemId: 68646,
  count: 29500,
  content: [
    { id: 45175, count: 79494 }, // Essence of Luck (Fine)
    { id: 45176, count: 25558 }, // Essence of Luck (Masterwork)
    { id: 45177, count: 20668 }, // Essence of Luck (Rare)
    { id: 45178, count: 8201 }, // Essence of Luck (Exotic)
    { id: 45179, count: 770 }, // Essence of Luck (Legendary)
    { id: 68632, count: 2350 }, // Spring Roll
    { id: 68633, count: 2418 }, // Fried Golden Dumpling
    { id: 68634, count: 1669 }, // Delicious Rice Ball
    { id: 68635, count: 2308 }, // Steamed Red Dumpling
    { id: 68636, count: 2405 }, // Sweet Bean Bun
    { id: 68640, count: 1309 }, // Ornamental Golden Trophy
    { id: 77686, count: 4904 }, // Lucky Guild Firework
    { id: 77699, count: 3306 }, // Lucky New Year Firework
    { id: 77747, count: 4678 }, // Lucky Prismatic Rocket
    { id: 77750, count: 18813 }, // Lucky Draketail
    { id: 89999, count: 495 }, // Superior Rune of Fireworks
    { id: 90001, count: 482 }, // Mini Festive Lantern
    { id: 99308, count: 30417 }, // Golden Rabbit Figurine
    { id: 99313, count: 46 }, // Lucky Great Rabbit Lantern
    { id: 99326, count: 0 }, // New Year's Weapon Chest
    { id: 99327, count: 493 }, // Lucky Rabbit Lantern
    { id: 99340, count: 1974 }, // Visage of the Great Rabbit Fireworks
  ]
};

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
}, ['drop-mockup'], { revalidate: 60 });

function getAverage(item: Awaited<ReturnType<typeof loadItems>>[number], count: number, total: number) {
  const avg = total / count;
  const buyPrice = item.buyPrice ?? item.vendorValue;
  const sellPrice = item.sellPrice ?? item.vendorValue;

  return {
    avg,
    avgBuyPrice: buyPrice ? buyPrice * avg : buyPrice,
    avgSellPrice: sellPrice ? sellPrice * avg : sellPrice
  };
}

export default async function DropMockupPage({ params }: PageProps) {
  const { language } = await params;
  const vendorValueTranslations = await translateMany(['item.flag.NoSell'], language);
  const items = await loadItems([drf.itemId, ...drf.content.map(({ id }) => id)]);
  const itemsById = groupById(items);

  const drops = drf.content.map((entry) => ({
    ...entry,
    item: itemsById.get(entry.id)!,
    ...getAverage(itemsById.get(entry.id)!, drf.count, entry.count)
  }));

  const Items = createDataTable(drops, ({ id }) => id);

  const avgBuyPrice = drops.reduce((acc, cur) => acc + (cur.avgBuyPrice ?? 0), 0);
  const avgSellPrice = drops.reduce((acc, cur) => acc + (cur.avgSellPrice ?? 0), 0);

  return (
    <PageLayout>
      <Headline id={drf.itemId.toString()} actions={<ColumnSelect table={Items}/>}><ItemLink item={itemsById.get(drf.itemId)!}/></Headline>
      <p>Based on <FormatNumber value={drf.count}/> drops at 750% Magic Find. Data provided by <ExternalLink href="drf.rs"><Icon icon="drf"/> DRF</ExternalLink>.</p>
      <Items.Table>
        <Items.Column id="item" title="Item" fixed>{({ item }) => <ItemLink item={item}/>}</Items.Column>
        <Items.Column id="rarity" title={<Trans id="itemTable.column.rarity"/>} sortBy={({ item }) => item.rarity} hidden>{({ item }) => <Rarity rarity={item.rarity}><Trans id={`rarity.${item.rarity}`}/></Rarity>}</Items.Column>
        <Items.Column id="avg" title="Avg. Droprate" align="right" sortBy="avg">{({ avg, count }) => <Tip tip={<><Fraction numerator="Total" denominator="Count"/> = <Fraction denominator={<FormatNumber value={count}/>} numerator={<FormatNumber value={drf.count}/>}/></>}><FormatNumber value={avg}/></Tip>}</Items.Column>
        <Items.Column id="vendor" title={<Trans id="itemTable.column.vendorValue"/>} sortBy={({ item }) => item.vendorValue} align="right" hidden>{({ item }) => itemTableColumn.vendorValue(item, vendorValueTranslations)}</Items.Column>
        <Items.Column id="buyPrice" title={<Trans id="itemTable.column.buyPrice"/>} sortBy={({ item }) => item.buyPrice} align="right" hidden>{({ item }) => itemTableColumn.buyPrice(item, {})}</Items.Column>
        <Items.Column id="buyPriceTrend" title={<Trans id="itemTable.column.buyPriceTrend"/>} align="right" hidden>{({ item }) => itemTableColumn.buyPriceTrend(item, {})}</Items.Column>
        <Items.Column id="buyQuantity" title={<Trans id="itemTable.column.buyQuantity"/>} sortBy={({ item }) => item.buyQuantity} align="right" hidden>{({ item }) => itemTableColumn.buyQuantity(item, {})}</Items.Column>
        <Items.Column id="sellPrice" title={<Trans id="itemTable.column.sellPrice"/>} sortBy={({ item }) => item.sellPrice} align="right" hidden>{({ item }) => itemTableColumn.sellPrice(item, {})}</Items.Column>
        <Items.Column id="sellPriceTrend" title={<Trans id="itemTable.column.sellPriceTrend"/>} align="right" hidden>{({ item }) => itemTableColumn.sellPriceTrend(item, {})}</Items.Column>
        <Items.Column id="sellQuantity" title={<Trans id="itemTable.column.sellQuantity"/>} sortBy={({ item }) => item.sellQuantity} align="right" hidden>{({ item }) => itemTableColumn.sellQuantity(item, {})}</Items.Column>

        <Items.Column id="avgBuyPrice" title="Avg. Buy Price per" sortBy="avgBuyPrice" align="right" fixed>{({ avgBuyPrice }) => avgBuyPrice ? <Coins value={Math.ceil(avgBuyPrice)}/> : '-'}</Items.Column>
        <Items.Column id="avgSellPrice" title="Avg. Sell Price per" sortBy="avgSellPrice" align="right" fixed>{({ avgSellPrice }) => avgSellPrice ? <Coins value={Math.ceil(avgSellPrice)}/> : '-'}</Items.Column>
        <Items.Footer>
          <DataTableFooterTd colSpan={-2} align="right">Total Average</DataTableFooterTd>
          <td align="right"><Coins value={Math.ceil(avgBuyPrice)}/></td>
          <td align="right"><Coins value={Math.ceil(avgSellPrice)}/></td>
        </Items.Footer>
      </Items.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Test'
};
