import type { FC, ReactNode } from 'react';
import styles from './hero.module.css';
import { Icon } from '@gw2treasures/ui';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { preload } from 'react-dom';

import bg from './four-winds-bg.avif';
import left from './four-winds-left.avif';
import right from './four-winds-right.avif';

export const heroNoImageClass = styles.heroNoImageClass;

export interface FourWindsHeroProps {
  children: ReactNode,
}

export const FourWindsHero: FC<FourWindsHeroProps> = ({ children }) => {
  // preload background images
  preload(bg.src, { as: 'image' });
  preload(left.src, { as: 'image' });
  preload(right.src, { as: 'image' });

  return (
    <div className={styles.hero}>
      <div className={styles.left}/>
      <div className={styles.right}/>
      <div className={styles.content}>
        {children}
      </div>
      <Tip tip={<>Artwork by Ilona <Icon icon="external-link"/></>} preferredPlacement="left">
        <a target="_blank" rel="noreferrer noopener" href="https://linktr.ee/Efnyea" className={styles.ilona}><Icon icon="info"/></a>
      </Tip>
    </div>
  );
};
