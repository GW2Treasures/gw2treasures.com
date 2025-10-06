import type { FC, ReactNode } from 'react';
import styles from './hero.module.css';
import { Icon } from '@gw2treasures/ui';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { preload } from 'react-dom';

import bg from './halloween-bg.avif';
import left from './halloween-left.avif';
import right from './halloween-right.avif';

export const heroNoImageClass = styles.heroNoImageClass;

export interface HalloweenHeroProps {
  children: ReactNode,
}

export const HalloweenHero: FC<HalloweenHeroProps> = ({ children }) => {
  // preload background images (the right image is hidden at 800px or smaller)
  preload(bg.src, { as: 'image', fetchPriority: 'high', type: 'image/avif' });
  preload(left.src, { as: 'image', fetchPriority: 'high', type: 'image/avif' });
  preload(right.src, { as: 'image', fetchPriority: 'high', type: 'image/avif', media: '(min-width: 801px)' });

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
