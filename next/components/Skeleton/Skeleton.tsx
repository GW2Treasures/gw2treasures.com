import { FC } from 'react';
import style from './Skeleton.module.css';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
}

export const Skeleton: FC<SkeletonProps> = ({ width, height }) => {
  return <span className={style.skeleton} style={{ width, height }}/>;
};
