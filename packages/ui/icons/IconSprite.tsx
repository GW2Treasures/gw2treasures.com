import { forwardRef, type SVGAttributes } from 'react';
import type { IconName } from '@gw2treasures/icons';
import reactDOM from 'react-dom';
import styles from './IconSprite.module.css';

export interface IconSpriteProps extends SVGAttributes<SVGSVGElement> {
  icon: IconName,
}

// load sprite as asset module. If just importing, it will be loaded as Next.js image object ({ src, width, … })
// and is not compatible with just webpack used outside of Next.js (i.e. gw2.me extensions)
const sprite = new URL('@gw2treasures/icons/sprite.svg', import.meta.url).toString();

export const IconSprite = forwardRef<SVGSVGElement, IconSpriteProps>(function IconSprite({ icon, ...props }, ref) {
  // preload in react@canary (has preload), react@18 has no preload
  // TODO: remove once using react@beta or react@19
  if('preload' in reactDOM && typeof reactDOM.preload === 'function') {
    reactDOM.preload(sprite, { as: 'image' });
  }

  return (
    <svg ref={ref} viewBox="0 0 16 16" {...props}>
      <use href={`${sprite}#${icon}`} className={styles[icon]}/>
    </svg>
  );
});
