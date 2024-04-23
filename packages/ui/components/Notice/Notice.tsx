import { type ReactNode, forwardRef } from 'react';
import styles from './Notice.module.css';
import { type IconName } from '@gw2treasures/icons';
import { cx } from '../../lib';
import { Icon } from '../../icons';

export interface NoticeProps {
  children: ReactNode;
  type?: 'info' | 'warning' | 'error';
  icon?: IconName;
}

export const Notice = forwardRef<HTMLDivElement, NoticeProps>(function Notice({ children, type = 'info', icon }, ref) {
  return (
    <div className={cx(styles.notice, styles[type])} ref={ref}>
      {icon && <Icon icon={icon} className={styles.icon}/>}
      <div className={styles.content}>{children}</div>
    </div>
  );
});
