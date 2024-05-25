import type { CSSProperties, FC, ReactNode } from 'react';
import styles from './HeroLayout.module.css';
import { PageLayout } from './PageLayout';
import { preload } from 'react-dom';

const heroMask = new URL('./hero-mask.jpg', import.meta.url).toString();

export interface HeroLayoutProps {
  children: ReactNode;
  hero: ReactNode;
  color?: CSSProperties['--hero-color'];
  toc?: boolean;
  skipPreload?: boolean;
}

export const HeroLayout: FC<HeroLayoutProps> = ({ children, hero, color, toc, skipPreload }) => {
  if(!skipPreload) {
    preload(heroMask, { as: 'image' });
  }

  return (
    <div style={{ '--hero-color': color ?? '#b7000d' }}>
      <div className={styles.hero}>{hero}</div>
      <PageLayout toc={toc}>{children}</PageLayout>
    </div>
  );
};
