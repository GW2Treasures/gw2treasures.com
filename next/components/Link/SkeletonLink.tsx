import { FC } from 'react';
import { IconSize } from '@/lib/getIconUrl';
import { Skeleton } from '../Skeleton/Skeleton';
import styles from './Link.module.css';

export interface SkeletonLinkProps {
  icon?: IconSize | 'none'
}

export const SkeletonLink: FC<SkeletonLinkProps> = ({ icon = 32 }) => {
  if(icon === 'none') {
    return (
      <Skeleton/>
    );
  }

  return (
    <div className={styles.link}>
      <Skeleton width={icon} height={icon}/>
      <Skeleton/>
    </div>
  );
};
