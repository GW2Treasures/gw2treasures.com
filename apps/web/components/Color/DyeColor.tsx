import type { FC } from 'react';
import type { RGB } from './types';
import styles from './DyeColor.module.css';
import { cx } from '@gw2treasures/ui/lib';
import { isDark } from './is-dark';

interface DyeColorProps {
  color: RGB,
};

export const DyeColor: FC<DyeColorProps> = ({ color }) => {
  return (
    <div className={cx(styles.box, isDark(color) && styles.dark)} style={{ backgroundColor: `rgb(${color.join(' ')})` }}/>
  );
};
