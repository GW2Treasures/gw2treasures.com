'use client';

import { type FC, useEffect, useState } from 'react';
import { Coins } from '../Format/Coins';
import { FormatNumber } from '../Format/FormatNumber';
import { fetchGw2Api } from '@gw2api/fetch';
import styles from './TradingPost.module.css';
import type { Price } from '@gw2api/types/data/commerce';

export interface TradingPostProps {
  itemId: number;
}

export const TradingPost: FC<TradingPostProps> = ({ itemId }) => {
  const [tpData, setTpData] = useState<Price>();

  useEffect(() => {
    fetchGw2Api(`/v2/commerce/prices/${itemId}`, {}).then(setTpData);
  }, [itemId]);

  return (
    <>
      <b>Sell Price: </b>
      <div className={styles.tp}>
        <span><FormatNumber value={tpData?.sells?.quantity ?? 0}/> available</span>
        <Coins value={tpData?.sells?.unit_price ?? 0}/>
      </div>
      <b>Buy Price:</b>
      <div className={styles.tp}>
        <span><FormatNumber value={tpData?.buys?.quantity ?? 0}/> ordered</span>
        <Coins value={tpData?.buys?.unit_price ?? 0}/>
      </div>
    </>
  );
};
