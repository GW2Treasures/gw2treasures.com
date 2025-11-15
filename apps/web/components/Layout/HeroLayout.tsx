import { cx } from '@gw2treasures/ui';
import type { CSSProperties, FC, ReactNode } from 'react';
import { preload } from 'react-dom';
import styles from './HeroLayout.module.css';
import { PageLayout } from './PageLayout';

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
    <div className={styles.layout} style={color ? { '--hero-color': color } : undefined}>
      <div className={cx(styles.hero, heroClassName)}>{hero}</div>
      {navBar}
      {skipLayout ? children : (
        <PageLayout toc={toc}>{children}</PageLayout>
      )}
    </div>
  );
};
