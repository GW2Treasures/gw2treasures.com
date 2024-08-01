import type { FC } from 'react';
import styles from './DyeSlots.module.css';
import { cx } from '@gw2treasures/ui/lib';
import type { RGB } from './types';
import { isDark } from './is-dark';

interface DyeSlotsProps {
  slots: RGB[]
}

export const DyeSlots: FC<DyeSlotsProps> = ({ slots }) => {
  if(slots.length === 0) {
    return null;
  }

  return (
    <div className={styles.dyeSlots}>
      {slots.slice(0, 4).map((slot, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={cx(styles.slot, isDark(slot) && styles.dark)} style={{ backgroundColor: `rgb(${ slot.join(' ') })` }}/>
      ))}
    </div>
  );
};

