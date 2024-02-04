import type { CSSProperties, FC, ReactNode } from 'react';
import styles from './HeroLayout.module.css';
import { PageLayout } from './PageLayout';
import { preload } from 'react-dom';
import heroMask from './hero-mask.jpg';

export interface HeroLayoutProps {
  children: ReactNode;
  hero: ReactNode;
  color?: CSSProperties['--hero-color'];
  toc?: boolean;
}

export const HeroLayout: FC<HeroLayoutProps> = ({ children, hero, color, toc }) => {
  preload(heroMask.src, { as: 'image' });

  return (
    <div style={{ '--hero-color': color ?? '#b7000d' }}>
      <div className={styles.hero}>{hero}</div>
      <PageLayout toc={toc}>{children}</PageLayout>
    </div>
  );
};
