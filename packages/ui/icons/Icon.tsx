import { cloneElement, CSSProperties, forwardRef, FunctionComponent } from 'react';
import { getIcon, IconProp } from './index';
import styles from './Icon.module.css';

export interface IconProps {
  icon: IconProp,
  color?: CSSProperties['--icon-color'];
};

export const Icon: FunctionComponent<IconProps> = forwardRef(function Icon({ icon, color }, ref) {
  const c = getIcon(icon);

  return c ? cloneElement(c, { className: styles.icon, style: { '--icon-color': color }, ref }) : null;
});
