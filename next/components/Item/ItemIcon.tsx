'use client';

/* eslint-disable @next/next/no-img-element */
import { FC, useCallback, useState } from 'react';
import { Icon } from '@prisma/client';
import styles from './ItemIcon.module.css';
import { getIconUrl, IconSize } from '@/lib/getIconUrl';

export interface ItemIconProps {
  icon: Icon;
  size?: IconSize
}

export const ItemIcon: FC<ItemIconProps> = ({ icon, size = 64 }) => {
  const [loading, setLoading] = useState(true);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <img
      ref={(img) => img?.complete && setLoading(false)}
      src={getIconUrl(icon, size)}
      width={size}
      height={size}
      alt=""
      crossOrigin="anonymous"
      loading="lazy"
      srcSet={size < 64 ? `${getIconUrl(icon, size * 2 as IconSize)} 2x` : undefined}
      className={loading ? styles.loading : styles.icon}
      onLoad={handleLoad}/>
  );
};
