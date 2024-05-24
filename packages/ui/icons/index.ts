import { icons, type IconName } from '@gw2treasures/icons';
import { createElement, type CSSProperties } from 'react';
import { IconSprite, type IconSpriteProps } from './IconSprite';

export { type IconName } from '@gw2treasures/icons';

export type IconProp = IconName | React.JSX.Element;
export type IconColor = CSSProperties['--icon-color'];

export function getIcon(icon: IconName): React.ReactElement<IconSpriteProps>;
export function getIcon(icon?: IconProp): React.JSX.Element | undefined;
export function getIcon(icon?: IconProp): React.JSX.Element | undefined {
  if(typeof icon === 'string') {
    if(icons.includes(icon)) {
      return createElement(IconSprite, { icon });
    }

    console.warn(`Tried to access invalid icon '${icon}'`);
    return undefined;
  }

  return icon;
}

// re-export icon component
export * from './Icon';
