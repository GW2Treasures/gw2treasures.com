import { FC, ReactNode } from 'react';
import { Icon, IconName } from '@gw2treasures/ui';
import { cx } from '../../lib/classNames';
import styles from './Notice.module.css';

export interface NoticeProps {
  children: ReactNode;
  type?: 'info' | 'warning';
  icon?: IconName;
}

export const Notice: FC<NoticeProps> = ({ children, type = 'info', icon }) => {
  return (
    <div className={cx(styles.notice, styles[type])}>
      {icon && <Icon icon={icon}/>}
      <p className={styles.content}>{children}</p>
    </div>
  );
};
