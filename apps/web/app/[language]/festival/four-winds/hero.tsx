import type { FC, ReactNode } from 'react';
import styles from './hero.module.css';

export interface FourWindsHeroProps {
  children: ReactNode
}

export const FourWindsHero: FC<FourWindsHeroProps> = ({ children }) => {
  return (
    <div className={styles.hero}>
      {children}
    </div>
  );
};
