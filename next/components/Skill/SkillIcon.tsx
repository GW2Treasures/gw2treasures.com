'use client';

/* eslint-disable @next/next/no-img-element */
import { FC, useState } from 'react';
import { Icon } from '@prisma/client';
import styles from './SkillIcon.module.css';
import { cx } from '../../lib/classNames';
import { getIconUrl, IconSize } from '@/lib/getIconUrl';

export interface SkillIconProps {
  icon: Omit<Icon, 'color'> & Partial<Pick<Icon, 'color'>>;
  size?: IconSize;
  className?: string;
}

export const SkillIcon: FC<SkillIconProps> = ({ icon, size = 64, className }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={cx(styles.wrapper, className)}>
      <img
        src={getIconUrl(icon, size)}
        width={size}
        height={size}
        alt=""
        crossOrigin="anonymous"
        loading="lazy"
        srcSet={size < 64 ? `${getIconUrl(icon, size * 2 as IconSize)} 2x` : undefined}
        className={loading ? styles.loading : (className ? styles.iconFill : styles.icon)}
        onLoad={() => setLoading(false)}/>
    </div>
  );
};
