import type { FC, ReactNode } from 'react';
import { cx } from '@gw2treasures/ui';
import styles from './Rarity.module.css';
import rarityStyles from '../Layout/RarityColor.module.css';

export interface RarityProps {
  rarity: string;
  children?: ReactNode;
}

export const Rarity: FC<RarityProps> = ({ rarity, children }) => {
  return <span className={cx(rarityStyles[rarity], styles.rarity)}>{children ?? rarity}</span>;
};
