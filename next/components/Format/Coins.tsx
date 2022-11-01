import { FC } from 'react';
import styles from './Coins.module.css';

interface CoinsProps {
  value: number;
};

export const Coins: FC<CoinsProps> = ({ value }) => {
  const gold = Math.floor(value / 10000);
  const silver = Math.floor((value % 10000) / 100);
  const copper = value % 100;

  return (
    <span>
      {gold > 0 && <span className={styles.g}>{gold}</span>}
      {silver > 0 && <span className={styles.s}>{silver}</span>}
      {(copper > 0 || value === 0) && <span className={styles.c}>{copper}</span>}
    </span>
  );
};
