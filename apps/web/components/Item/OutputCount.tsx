import { FC, ReactNode } from 'react';
import styles from './OutputCount.module.css';

export interface OutputCountProps {
  count: number;
  children: ReactNode;
}

export const OutputCount: FC<OutputCountProps> = ({ count, children }) => {
  if(count === 1) {
    return <>{children}</>;
  }

  return (
    <div className={styles.outputCount}>
      {children}
      {count > 1 && `×${count}`}
    </div>
  );
};
