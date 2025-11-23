'use client';

import type { FC } from 'react';
import styles from './Coins.module.css';
import { useFormattedNumber } from './FormatNumber';
import { cx } from '@gw2treasures/ui';

interface CoinsProps {
  value: number,
  long?: boolean,
}

export const Coins: FC<CoinsProps> = ({ value, long }) => {
  const { gold, silver, copper } = useFormattedCoins(value);

  // TODO: translate
  const label = [
    gold.hidden ? undefined : `${gold.value} gold`,
    silver.hidden ? undefined : `${silver.value} silver`,
    copper.hidden ? undefined : `${copper.value} copper`,
  ].filter(Boolean).join(', ');

  return (
    <data value={value} className={long ? styles.long : styles.short} aria-label={label}>
      {value >= 10000 && (
        <span className={styles.g} aria-hidden>{gold.value}</span>
      )}
      {value >= 100 && (
        <span className={cx(styles.s, silver.hidden && styles.hidden)} aria-hidden>
          {silver.pad && (<span className={styles.pad}>{silver.pad}</span>)}
          {silver.value}
        </span>
      )}
      <span className={cx(styles.c, copper.hidden && styles.hidden)} aria-hidden>
        {copper.pad && (<span className={styles.pad}>{copper.pad}</span>)}
        {copper.value}
      </span>
    </data>
  );
};

export function coinsToGoldSilverCopper(coins: number) {
  const gold = Math.floor(coins / 10000);
  const silver = Math.floor((coins % 10000) / 100);
  const copper = coins % 100;

  return { gold, silver, copper };
}

interface CoinDisplay {
  hidden: boolean,
  value: string,
  pad: string,
}

function useFormattedCoins(value: number, long?: boolean): Record<'gold' | 'silver' | 'copper', CoinDisplay> {
  const { gold, silver, copper } = coinsToGoldSilverCopper(value);

  // TODO: in the future, even long format could hide silver/copper based on the context
  //   eg. a column where all values never have a silver/copper value

  return {
    gold: {
      hidden: value < 10000,
      value: useFormattedNumber(gold),
      pad: ''
    },
    silver: {
      hidden: value < 100 || (silver === 0 && !long),
      value: silver > 0 ? silver.toString() : '',
      pad: value >= 10000 && silver < 10 ? silver === 0 ? '00' : '0' : ''
    },
    copper: {
      hidden: value > 0 && copper === 0 && !long,
      value: copper > 0 || value === 0 ? copper.toString() : '',
      pad: value >= 100 && copper < 10 ? copper === 0 && value > 0 ? '00' : '0' : ''
    }
  };
}
