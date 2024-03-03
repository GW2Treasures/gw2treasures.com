import type { FC } from 'react';
import { EntityIconMissing } from '../Entity/EntityIconMissing';
import type { IconSize } from '@/lib/getIconUrl';
import styles from './UnknownItem.module.css';
import { encode } from 'gw2e-chat-codes';

export interface UnknownItemProps {
  id: number,
  icon?: IconSize | 'none'
}

export const UnknownItem: FC<UnknownItemProps> = ({ id, icon = 32 }) => {
  const chatlink = encode('item', id);

  return (
    <span className={styles.unknown}>
      {icon !== 'none' && (<EntityIconMissing size={icon}/>)}
      <span className={styles.label}>Unknown item <span className={styles.chatlink}>{chatlink}</span></span>
    </span>
  );
};
