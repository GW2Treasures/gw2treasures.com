'use client';

import { Icon } from '@gw2treasures/ui';
import { useId, type FC } from 'react';
import styles from './Chatlink.module.css';

export interface ChatlinkProps {
  chatlink: string;
}

export const Chatlink: FC<ChatlinkProps> = ({ chatlink }) => {
  const id = useId();

  return (
    <label className={styles.box} htmlFor={id}>
      <span className={styles.icon}><Icon icon="chatlink"/></span>
      <input readOnly id={id} value={chatlink} className={styles.input} onFocus={(e) => e.target.select()}/>
    </label>
  );
};
