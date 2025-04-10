import type { FC, ReactNode } from 'react';
import styles from './hero.module.css';

export interface SuperAdventureFestivalHeroProps {
  children: ReactNode
}

export const SuperAdventureFestivalHero: FC<SuperAdventureFestivalHeroProps> = ({ children }) => {
  return (
    <div className={styles.hero}>
      {children}
    </div>
  );
};
