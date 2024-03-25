import { type FC, type ReactNode } from 'react';
import styles from './OutputCount.module.css';
import { OutputCount } from './OutputCount';

export interface OutputCountRangeProps {
  min: number;
  max: number;
  children: ReactNode;
}

export const OutputCountRange: FC<OutputCountRangeProps> = ({ min, max, children }) => {
  if(min === max) {
    return (
      <OutputCount count={min}>{children}</OutputCount>
    );
  }

  return (
    <div className={styles.outputCount}>
      {children}
      {`× ${min} – ${max}`}
    </div>
  );
};
