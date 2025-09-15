import type { CSSProperties, FC, ReactNode } from 'react';
import styles from './HeroLayout.module.css';
import { PageLayout } from './PageLayout';
import { preload } from 'react-dom';
import { cx } from '@gw2treasures/ui';

const heroMask = new URL('./hero-mask.jpg', import.meta.url).toString();

export interface HeroLayoutProps {
  children: ReactNode,
  hero: ReactNode,
  heroClassName?: string,
  navBar?: ReactNode,
  color?: CSSProperties['--hero-color'],
  toc?: boolean,
  skipPreload?: boolean,
  skipLayout?: boolean,
}

export const HeroLayout: FC<HeroLayoutProps> = ({ children, hero, heroClassName, navBar, color, toc, skipPreload, skipLayout }) => {
  if(!skipPreload) {
    preload(heroMask, { as: 'image' });
  }

  return (
    <div style={{ '--hero-color': color ?? '#b7000d' }}>
      <div className={cx(styles.hero, heroClassName)}>{hero}</div>
      {navBar}
      {skipLayout ? children : (
        <PageLayout toc={toc}>{children}</PageLayout>
      )}
    </div>
  );
};
