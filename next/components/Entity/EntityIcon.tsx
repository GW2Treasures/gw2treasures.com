'use client';

/* eslint-disable @next/next/no-img-element */
import { FC, useCallback, useState } from 'react';
import { Icon } from '@prisma/client';
import styles from './EntityIcon.module.css';
import { getIconUrl, IconSize } from '@/lib/getIconUrl';

export interface EntityIconProps {
  icon: Omit<Icon, 'color'> & Partial<Pick<Icon, 'color'>>;
  size?: IconSize
}

export const EntityIcon: FC<EntityIconProps> = ({ icon, size = 64 }) => {
  const [loading, setLoading] = useState(true);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <img
      loading="lazy"
      decoding="async"
      ref={(img) => img?.complete && setLoading(false)}
      src={getIconUrl(icon, size)}
      width={size}
      height={size}
      alt=""
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      srcSet={size < 64 ? `${getIconUrl(icon, size * 2 as IconSize)} 2x` : undefined}
      style={icon.color ? { '--loading-color': icon.color } : undefined}
      className={loading ? styles.loading : styles.icon}
      onLoad={handleLoad}/>
  );
};
