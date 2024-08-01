import type { FC } from 'react';
import styles from './Coins.module.css';
import { FormatNumber } from './FormatNumber';

interface CoinsProps {
  value: number;
}

export const Coins: FC<CoinsProps> = ({ value }) => {
  const { gold, silver, copper } = coinsToGoldSilverCopper(value);

  return (
    <span className={styles.coins}>
      {gold > 0 && <span className={styles.g}><FormatNumber value={gold}/></span>}
      {silver > 0 && <span className={styles.s}>{silver}</span>}
      {(copper > 0 || value === 0) && <span className={styles.c}>{copper}</span>}
    </span>
  );
};

export function coinsToGoldSilverCopper(coins: number) {
  const gold = Math.floor(coins / 10000);
  const silver = Math.floor((coins % 10000) / 100);
  const copper = coins % 100;

  return { gold, silver, copper };
}
