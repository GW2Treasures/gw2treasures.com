import { type FC, type SVGAttributes } from 'react';
import type { IconName } from '@gw2treasures/icons';
import styles from './IconSprite.module.css';
import type { RefProp } from '../lib/react';

export interface IconSpriteProps extends SVGAttributes<SVGSVGElement>, RefProp<SVGSVGElement> {
  icon: IconName,
}

// load sprite as asset module. If just importing, it will be loaded as Next.js image object ({ src, width, … })
// and is not compatible with just webpack used outside of Next.js (i.e. gw2.me extensions)
const sprite = new URL('@gw2treasures/icons/sprite.svg', import.meta.url).toString();

export const IconSprite: FC<IconSpriteProps> = ({ ref, icon, ...props }) => {
  // TODO: preloading sprites is not possible in browsers yet (see https://github.com/whatwg/fetch/issues/1012)
  // reactDOM.preload(sprite, { as: 'image' });

  return (
    <svg ref={ref} viewBox="0 0 16 16" {...props}>
      <use href={`${sprite}#${icon}`} className={styles[icon]}/>
    </svg>
  );
};
