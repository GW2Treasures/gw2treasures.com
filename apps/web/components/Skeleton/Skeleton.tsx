import { cx } from '@gw2treasures/ui';
import type { FC } from 'react';
import style from './Skeleton.module.css';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Skeleton: FC<SkeletonProps> = ({ width, height, className }) => {
  return <span className={cx(style.skeleton, className)} style={{ width, height }}/>;
};
