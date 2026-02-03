import type { IconSize } from '@/lib/getIconUrl';
import { ChatlinkType, encodeChatlink } from '@gw2/chatlink';
import type { FC } from 'react';
import { EntityIconMissing } from '../Entity/EntityIconMissing';
import styles from './UnknownItem.module.css';

export interface UnknownItemProps {
  id: number,
  icon?: IconSize | 'none',
}

export const UnknownItem: FC<UnknownItemProps> = ({ id, icon = 32 }) => {
  const chatlink = encodeChatlink(ChatlinkType.Item, id);

  return (
    <span className={styles.unknown}>
      {icon !== 'none' && (<EntityIconMissing size={icon}/>)}
      <span className={styles.label}>Unknown item <span className={styles.chatlink}>{chatlink}</span></span>
    </span>
  );
};
