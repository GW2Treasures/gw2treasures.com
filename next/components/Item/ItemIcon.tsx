import { FC, useState } from 'react';
import { Icon } from '@prisma/client';
import styles from './ItemIcon.module.css';

export type IconSize = 16 | 32 | 64;

export interface ItemIconProps {
  icon: Icon;
  size?: IconSize
}

export function getIconUrl({ id, signature }: Icon, size: IconSize) {
  return `https://icons-gw2.darthmaim-cdn.com/${signature}/${id}-${size}px.png`;
}

export const ItemIcon: FC<ItemIconProps> = ({ icon, size = 64 }) => {
  const [loading, setLoading] = useState(true);

  return <img src={getIconUrl(icon, size)} width={size} height={size} alt="" crossOrigin="anonymous" loading="lazy" srcSet={size < 64 ? `${getIconUrl(icon, size * 2 as IconSize)} 2x` : undefined} className={loading ? styles.loading : styles.icon} onLoad={() => setLoading(false)}/>
};
