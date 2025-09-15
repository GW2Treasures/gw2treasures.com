import type { FC, ReactNode } from 'react';
import styles from './hero.module.css';

export interface LunarNewYearHeroProps {
  children: ReactNode,
}

export const LunarNewYearHero: FC<LunarNewYearHeroProps> = ({ children }) => {
  return (
    <div className={styles.hero}>
      {children}
    </div>
  );
};
