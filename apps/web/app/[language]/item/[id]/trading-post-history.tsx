import type { AsyncComponent } from '@/lib/asyncComponent';
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

export const TradingPostHistoryAsync: AsyncComponent<TradingPostHistoryProps> = async ({ itemId }) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);

  const history = await db.tradingPostHistory.findMany({
    where: { itemId, time: { gt: startDate }},
    orderBy: { time: 'asc' },
  });

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  // TODO: use some more advanced downsampling
  const bucketSize = Math.ceil(history.length / 500);

  return (
    <TradingPostHistoryClientLazy history={history.filter((_, i) => i % bucketSize === 0)}/>
  );
};

export interface TradingPostHistoryLoadingProps { }

export const TradingPostHistoryLoading: FC<TradingPostHistoryLoadingProps> = ({}) => {
  return (
    <div style={{ padding: 64, textAlign: 'center', background: 'var(--color-background-light)', borderRadius: 2, color: 'var(--color-text-muted)' }}>
      <Icon icon="loading"/> Loading Trading Post History
    </div>
  );
};
