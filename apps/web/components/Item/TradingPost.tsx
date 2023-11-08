'use client';

import type { Gw2Api } from 'gw2-api-types';
import { type FC, useEffect, useState } from 'react';
import { Coins } from '../Format/Coins';
import { FormatNumber } from '../Format/FormatNumber';
import styles from './TradingPost.module.css';

export interface TradingPostProps {
  itemId: number;
}

export const TradingPost: FC<TradingPostProps> = ({ itemId }) => {
  const [tpData, setTpData] = useState<Gw2Api.Commerce.Price>();

  useEffect(() => {
    fetch(`https://api.guildwars2.com/v2/commerce/prices/${itemId}`).then((r) => r.json()).then((prices) => {
      setTpData(prices);
    });
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
