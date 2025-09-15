import { type FC, type ReactNode } from 'react';
import styles from './Notice.module.css';
import { type IconName } from '@gw2treasures/icons';
import { cx } from '../../lib';
import { Icon } from '../../icons';
import type { RefProp } from '../../lib/react';

export interface NoticeProps extends RefProp<HTMLDivElement> {
  children: ReactNode,
  type?: 'info' | 'warning' | 'error',
  icon?: IconName,

  /** Hide this Notice from google and other search engines */
  index?: boolean,
}

export const Notice: FC<NoticeProps> = ({ ref, children, type = 'info', icon, index }) => {
  return (
    <div className={cx(styles.notice, styles[type])} ref={ref} data-nosnippet={index === false ? true : undefined}>
      {icon && <Icon icon={icon} className={styles.icon}/>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};
