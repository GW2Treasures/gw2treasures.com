import type { CSSProperties, FC, ReactNode } from 'react';
import styles from './HeroLayout.module.css';
import { PageLayout } from './PageLayout';

export interface HeroLayoutProps {
  children: ReactNode;
  hero: ReactNode;
  color?: CSSProperties['--hero-color'];
  toc?: boolean;
}

export const HeroLayout: FC<HeroLayoutProps> = ({ children, hero, color, toc }) => {
  return (
    <div style={{ '--hero-color': color ?? '#b7000d' }}>
      <div className={styles.hero}>{hero}</div>
      <PageLayout toc={toc}>{children}</PageLayout>
    </div>
  );
};
