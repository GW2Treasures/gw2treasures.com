'use client';

import { fetchGw2Api } from '@gw2api/fetch';
import type { Price } from '@gw2api/types/data/commerce';
import { cx, Icon } from '@gw2treasures/ui';
import { type FC, useEffect, useState } from 'react';
import { Coins } from '../Format/Coins';
import { FormatNumber } from '../Format/FormatNumber';
import styles from './TradingPost.module.css';

export interface TradingPostProps {
  itemId: number,
  hideLoading?: boolean,
  className?: string,
  compact?: boolean,
}

export const TradingPost: FC<TradingPostProps> = ({ itemId, hideLoading, className, compact }) => {
  const [tp, setTp] = useState<Price>();

  useEffect(() => {
    const controller = new AbortController();

    fetchGw2Api(`/v2/commerce/prices/${itemId}`, { signal: controller.signal })
      .then(setTp)
      .catch(() => {});

    return () => controller.abort();
  }, [itemId]);

  if(!tp && hideLoading) {
    return null;
  }

  return (
    <dl className={cx(styles.tradingPost, compact && styles.compact, className)}>
      <dt>
        <span>Sell Price</span>
        {tp ? <Coins value={tp.sells.unit_price}/> : <Icon icon="loading"/>}
      </dt>
      <dd>
        <span>Available</span>
        {tp && (<FormatNumber value={tp.sells.quantity}/>)}
      </dd>
      <dt>
        <span>Buy Price</span>
        {tp ? <Coins value={tp.buys.unit_price}/> : <Icon icon="loading"/>}
      </dt>
      <dd>
        <span>Ordered</span>
        {tp && (<FormatNumber value={tp.buys.quantity}/>)}
      </dd>
    </dl>
  );
};
