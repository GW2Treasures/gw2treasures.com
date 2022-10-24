import { FC, ReactNode } from 'react';
import { IconName } from '../../icons';
import Icon from '../../icons/Icon';
import { cx } from '../../lib/classNames';
import styles from './Infobox.module.css';

export interface InfoboxProps {
  children: ReactNode;
  type?: 'info' | 'warning';
  icon?: IconName;
}

export const Infobox: FC<InfoboxProps> = ({ children, type = 'info', icon }) => {
  return <div className={cx(styles.infobox, styles[type])}>
    {icon && <Icon icon={icon}/>}
    <p className={styles.content}>{children}</p>
  </div>;
};
