import { forwardRef, type SVGAttributes } from 'react';
import sprite from '@gw2treasures/icons/sprite.svg';
import type { IconName } from '@gw2treasures/icons';
import { preload } from 'react-dom';
import styles from './IconSprite.module.css';

export interface IconSpriteProps extends SVGAttributes<SVGSVGElement> {
  icon: IconName,
}

export const IconSprite = forwardRef<SVGSVGElement, IconSpriteProps>(function IconSprite({ icon, ...props }, ref) {
  preload(sprite.src, { as: 'image' });

  return (
    <svg ref={ref} viewBox="0 0 16 16" {...props}><use href={sprite.src + '#' + icon} className={styles[icon]}/></svg>
  );
});
