import { cloneElement, CSSProperties, FunctionComponent } from 'react';
import { getIcon, Icon as IconType } from './index';
import styles from './Icon.module.css';

interface IconProps {
  icon: IconType
  color?: CSSProperties['--icon-color'];
};

const Icon: FunctionComponent<IconProps> = ({ icon, color }) => {
  const c = getIcon(icon);

  return c ? cloneElement(c, { className: styles.icon, style: { '--icon-color': color }}) : null;
};

export default Icon;
