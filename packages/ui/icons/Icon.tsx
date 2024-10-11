import { cloneElement, type FC } from 'react';
import { getIcon, type IconColor, type IconProp } from './index';
import styles from './Icon.module.css';
import { cx } from '../lib';
import type { RefProp } from '../lib/react';

export interface IconProps extends RefProp {
  icon: IconProp,
  color?: IconColor,
  className?: string,
}

export const Icon: FC<IconProps> = ({ ref, icon, color, className }) => {
  const c = getIcon(icon);

  return c ? cloneElement(c, { className: cx(styles.icon, className), style: { '--icon-color': color }, ref }) : null;
};
