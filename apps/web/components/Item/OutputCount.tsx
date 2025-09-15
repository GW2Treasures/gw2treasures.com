import { type FC, type ReactNode } from 'react';
import styles from './OutputCount.module.css';
import { FormatNumber } from '../Format/FormatNumber';

export interface OutputCountProps {
  count: number,
  children: ReactNode,
}

export const OutputCount: FC<OutputCountProps> = ({ count, children }) => {
  if(count === 1) {
    return <>{children}</>;
  }

  return (
    <div className={styles.outputCount}>
      {children}
      {count > 1 && <span>&times;<FormatNumber value={count}/></span>}
    </div>
  );
};
