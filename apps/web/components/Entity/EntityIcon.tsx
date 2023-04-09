'use client';

/* eslint-disable @next/next/no-img-element */
import { FC, useCallback, useState } from 'react';
import { Icon } from '@gw2treasures/database';
import styles from './EntityIcon.module.css';
import { getIconUrl, IconSize } from '@/lib/getIconUrl';
import { cx } from '@/lib/classNames';

export type EntityIconType = 'skill';

export interface EntityIconProps {
  icon: Omit<Icon, 'color'> & Partial<Pick<Icon, 'color'>>;
  size?: IconSize | number;
  type?: EntityIconType;
  className?: string;
}

const iconSizes: IconSize[] = [16, 32, 64];

function getIconSize(size: number): IconSize {
  return iconSizes.find((iconSize) => iconSize >= size) || 64;
}

export const EntityIcon: FC<EntityIconProps> = ({ icon, size = 64, type, className }) => {
  const iconSize = getIconSize(size);


  const [loading, setLoading] = useState(true);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <div className={cx(styles.wrapper, className)} data-icon-type={type}>
      <img
        loading="lazy"
        decoding="async"
        ref={(img) => img?.complete && setLoading(false)}
        src={getIconUrl(icon, iconSize)}
        width={size}
        height={size}
        alt=""
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        srcSet={iconSize < 64 ? `${getIconUrl(icon, size * 2 as IconSize)} 2x` : undefined}
        style={icon.color ? { '--loading-color': icon.color } : undefined}
        className={cx(loading ? styles.loading : styles.icon)}
        onLoad={handleLoad}/>
    </div>
  );
};
