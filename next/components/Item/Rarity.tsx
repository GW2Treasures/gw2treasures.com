import React, { FC } from 'react';
import { cx } from '../../lib/classNames';
import styles from './Rarity.module.css';
import rarityStyles from '../Layout/RarityColor.module.css';

export interface RarityProps {
  rarity: string
}

export const Rarity: FC<RarityProps> = ({ rarity }) => {
  return <span className={cx(rarityStyles[rarity], styles.rarity)}>{rarity}</span>;
};
