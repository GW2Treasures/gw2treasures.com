import { db } from '@/lib/prisma';
import { Suspense, type FC, lazy } from 'react';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Icon } from '@gw2treasures/ui';

export interface TradingPostHistoryProps {
  itemId: number
}

export const TradingPostHistory: FC<TradingPostHistoryProps> = ({ itemId }) => {
  return (
    <>
      <Headline id="tp">Trading Post History</Headline>

      <Suspense fallback={<TradingPostHistoryLoading/>}>
        <TradingPostHistoryAsync itemId={itemId}/>
      </Suspense>
    </>
  );
};

const TradingPostHistoryClientLazy = lazy(() => import('./trading-post-history.client').then(({ TradingPostHistoryClient }) => ({ default: TradingPostHistoryClient })));

export const TradingPostHistoryAsync: FC<TradingPostHistoryProps> = async ({ itemId }) => {
  const history = await db.tradingPostHistory.findMany({
    where: { itemId },
    orderBy: { time: 'asc' },
  });

  // const history = await db.$queryRaw`
  //   SELECT
  //     time_bucket('1 day', time) as time,
  //     MAX("sellPrice") as "sellPrice",
  //     MAX("buyPrice") as "buyPrice",
  //     MAX("sellQuantity")::int as "sellQuantity",
  //     MAX("buyQuantity")::int as "buyQuantity"
  //   FROM "TradingPostHistory"
  //   WHERE "itemId" = ${itemId}
  //   GROUP BY 1
  //   ORDER BY time ASC
  // ;`;

  return (
    <TradingPostHistoryClientLazy history={history}/>
  );
};

export const TradingPostHistoryLoading: FC = () => {
  return (
    <div style={{ padding: 64, textAlign: 'center', background: 'var(--color-background-light)', borderRadius: 2, color: 'var(--color-text-muted)' }}>
      <Icon icon="loading"/> Loading Trading Post History
    </div>
  );
};
