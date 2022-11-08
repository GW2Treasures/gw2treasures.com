import { cloneElement, CSSProperties, forwardRef, FunctionComponent } from 'react';
import { getIcon, Icon as IconType } from './index';
import styles from './Icon.module.css';

interface IconProps {
  icon: IconType
  color?: CSSProperties['--icon-color'];
};

const Icon: FunctionComponent<IconProps> = forwardRef(function Icon({ icon, color }, ref) {
  const c = getIcon(icon);

  return c ? cloneElement(c, { className: styles.icon, style: { '--icon-color': color }, ref }) : null;
});

export default Icon;
