import { cloneElement, FunctionComponent } from 'react';
import { getIcon, Icon as IconType } from './index';
import styles from './Icon.module.css';

interface IconProps {
  icon: IconType
};

const Icon: FunctionComponent<IconProps> = ({ icon }) => {
  const c = getIcon(icon);

  return c ? cloneElement(c, { className: styles.icon }) : null;
};

export default Icon;
