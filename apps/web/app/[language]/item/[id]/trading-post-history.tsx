import type { AsyncComponent } from '@/lib/asyncComponent';
import { db } from '@/lib/prisma';
import { Suspense, type FC, lazy } from 'react';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export interface TradingPostHistoryProps {
  itemId: number
}

export const TradingPostHistory: FC<TradingPostHistoryProps> = ({ itemId }) => {
  return (
    <>
      <Headline id="tp">Trading Post History</Headline>

      <Suspense fallback="Loading">
        <TradingPostHistoryAsync itemId={itemId}/>
      </Suspense>
    </>
  );
};

const TradingPostHistoryClientLazy = lazy(() => import('./trading-post-history.client').then(({ TradingPostHistoryClient }) => ({ default: TradingPostHistoryClient })));

export const TradingPostHistoryAsync: AsyncComponent<TradingPostHistoryProps> = async ({ itemId }) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 60);

  const history = await db.tradingPostHistory.findMany({
    where: { itemId, time: { gt: startDate }},
    orderBy: { time: 'asc' },
  });

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  const bucketSize = Math.ceil(history.length / 500);

  return (
    <TradingPostHistoryClientLazy history={history.filter((_, i) => i % bucketSize === 0)}/>
  );
};
