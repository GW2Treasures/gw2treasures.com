import type { FC, ReactNode } from 'react';
import styles from './Fraction.module.css';

export interface FractionProps {
  numerator: ReactNode,
  denominator: ReactNode,
}

export const Fraction: FC<FractionProps> = ({ numerator, denominator }) => {
  return (
    <span className={styles.fraction}>
      <span className={styles.numerator}>{numerator}</span>
      <span className={styles.denominator}>{denominator}</span>
    </span>
  );
};
