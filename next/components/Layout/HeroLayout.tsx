import React, { CSSProperties, FC, ReactNode } from 'react';
import styles from './HeroLayout.module.css';
import { PageLayout } from './PageLayout';

export interface HeroLayoutProps {
  children: ReactNode;
  hero: ReactNode;
  color?: CSSProperties['--hero-color']
}

export const HeroLayout: FC<HeroLayoutProps> = ({ children, hero, color }) => {
  return (
    <div>
      <div className={styles.hero} style={color ? { '--hero-color': color } : undefined}>{hero}</div>
      <PageLayout>{children}</PageLayout>
    </div>
  );
};
