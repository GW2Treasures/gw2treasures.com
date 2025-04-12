'use client';

/* eslint-disable @next/next/no-img-element */
import { type FC, useCallback, useState, type RefCallback, useMemo } from 'react';
import type { Icon } from '@gw2treasures/database';
import styles from './EntityIcon.module.css';
import { getIconSize, getIconUrl, type FixedIconSize, type IconSize } from '@/lib/getIconUrl';
import { cx } from '@gw2treasures/ui';

export type EntityIconType = 'skill';

export interface EntityIconProps {
  icon: Omit<Icon, 'color' | 'signature'> & Partial<Pick<Icon, 'color' | 'signature'>>;
  size?: IconSize;
  type?: EntityIconType;
  className?: string;
}

export const EntityIcon: FC<EntityIconProps> = ({ icon, size = 64, type, className }) => {
  const scaledIconSize = type === 'skill' ? size * 1.333333 : size;
  const iconSize = getIconSize(scaledIconSize);

  const [loading, setLoading] = useState(true);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const handleRef: RefCallback<HTMLImageElement> = useCallback((img) => {
    if(img?.complete) {
      setLoading(false);
    }
  }, []);

  const style = useMemo(() => icon.color ? { '--loading-color': icon.color } : undefined, [icon.color]);

  return (
    <span className={cx(styles.wrapper, className)} data-icon-type={type}>
      <img
        loading="lazy"
        decoding="async"
        ref={handleRef}
        src={getIconUrl(icon, iconSize)}
        width={size}
        height={size}
        alt=""
        referrerPolicy="no-referrer"
        srcSet={iconSize < 64 ? `${getIconUrl(icon, iconSize * 2 as FixedIconSize)} 2x` : undefined}
        style={style}
        className={cx(loading ? styles.loading : styles.icon)}
        onLoad={handleLoad}/>
    </span>
  );
};
