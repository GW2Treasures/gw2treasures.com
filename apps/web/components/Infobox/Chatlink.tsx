'use client';

import { Icon } from '@gw2treasures/ui';
import { FC } from 'react';
import styles from './Chatlink.module.css';

export interface ChatlinkProps {
  chatlink: string;
}

export const Chatlink: FC<ChatlinkProps> = ({ chatlink }) => {
  return (
    <label className={styles.box}>
      <span className={styles.icon}><Icon icon="chatlink"/></span>
      <input readOnly value={chatlink} className={styles.input} onFocus={(e) => e.target.select()}/>
    </label>
  );
};
