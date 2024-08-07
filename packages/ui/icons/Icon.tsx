import { cloneElement, forwardRef, type FunctionComponent } from 'react';
import { getIcon, type IconColor, type IconProp } from './index';
import styles from './Icon.module.css';
import { cx } from '../lib';

export interface IconProps {
  icon: IconProp,
  color?: IconColor,
  className?: string,
}

export const Icon: FunctionComponent<IconProps> = forwardRef(function Icon({ icon, color, className }, ref) {
  const c = getIcon(icon);

  return c ? cloneElement(c, { className: cx(styles.icon, className), style: { '--icon-color': color }, ref }) : null;
});
