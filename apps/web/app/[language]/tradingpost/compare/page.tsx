import { db } from '@/lib/prisma';
import styles from './page.module.css';
import { ItemLink } from '@/components/Item/ItemLink';
import { linkProperties } from '@/lib/linkProperties';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Icon } from '@gw2treasures/ui';
import { Coins } from '@/components/Format/Coins';
import { AddItemButton } from './add-item-button';
import { Chart } from './chart.client';
import { colorPalette } from './colors';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export default async function TradingpostChartsPage({ searchParams }: { searchParams: { ids?: string }}) {
  const itemIds = searchParams.ids?.split(',').map(Number).filter((id) => !isNaN(id) && id > 0 && Number.isInteger(id)).slice(0, 50) ?? [];

  const date = new Date();
  date.setDate(date.getDate() - 90);

  const items = await db.item.findMany({
    where: { id: { in: itemIds }},
    orderBy: { sellPrice: { sort: 'desc', nulls: 'last' }},
    select: { ...linkProperties, sellPrice: true, sellQuantity: true, buyPrice: true, buyQuantity: true, tpTradeable: true }
  });

  const itemIdsWithTpData = items.filter(({ tpTradeable }) => tpTradeable).map(({ id }) => id);

  const history = await db.tradingPostHistory.findMany({
    where: { itemId: { in: itemIdsWithTpData }, time: { gte: date }},
    orderBy: { time: 'asc' },
  });

  return (
    <div className={styles.layout}>
      <div className={styles.chartArea}>
        {itemIdsWithTpData.length > 0 && (
          <Chart data={history} items={items}/>
        )}
      </div>
      <div className={styles.itemArea}>
        <div style={{ padding: 16 }}>
          <Notice>This page is still work in progress.</Notice>
          <Headline id="compare">Compare Trading Post History</Headline>
        </div>
        {items.map((item, index) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.color} style={{ '--color': colorPalette[index % colorPalette.length] }}/>
            <ItemLink item={item}/>
            <div className={styles.itemPrices}>
              <div>Sell Price: {item.sellPrice ? <Coins value={item.sellPrice}/> : '-'}</div>
              <div>Buy Price: {item.sellPrice ? <Coins value={item.sellPrice}/> : '-'}</div>
            </div>
            <LinkButton iconOnly appearance="menu" href={`/tradingpost/compare?ids=${itemIds.filter((id) => id !== item.id)}`}><Icon icon="delete" color="var(--color-text-muted)"/></LinkButton>
          </div>
        ))}
        <AddItemButton ids={itemIds}>Add item</AddItemButton>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Compare Trading Post Charts',
  robots: { index: false }
};
