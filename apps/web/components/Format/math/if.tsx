import type { FC, ReactNode } from 'react';
import styles from './if.module.css';

export interface MathIfProps {
  a: ReactNode,
  aCondition: ReactNode,
  b: ReactNode,
  bCondition: ReactNode,
}

export const MathIf: FC<MathIfProps> = ({ a, aCondition, b, bCondition }) => {
  return (
    <span className={styles.if}>
      <svg xmlns="http://www.w3.org/2000/svg" width="7" height="32" fill="none" viewBox="0 0 7 32" className={styles.bracket}>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6 1.5A2.5 2.5 0 0 0 3.5 4v9A2.5 2.5 0 0 1 1 15.5 2.5 2.5 0 0 1 3.5 18v10A2.5 2.5 0 0 0 6 30.5"/>
      </svg>

      <span className={styles.a}>{a}</span>
      <span className={styles.aCondition}>{aCondition}</span>
      <span className={styles.b}>{b}</span>
      <span className={styles.bCondition}>{bCondition}</span>
    </span>
  );
};
