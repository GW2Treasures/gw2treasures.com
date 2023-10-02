import { FC, ReactNode } from 'react';
import styles from './Notice.module.css';
import { IconName } from '@gw2treasures/icons';
import { cx } from '../../lib';
import { Icon } from '../../icons';

export interface NoticeProps {
  children: ReactNode;
  type?: 'info' | 'warning' | 'error';
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
