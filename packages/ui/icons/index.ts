import { icons, type IconName } from '@gw2treasures/icons';
import { createElement } from 'react';

export { type IconName } from '@gw2treasures/icons';
export type IconProp = IconName | JSX.Element;

export function getIcon(icon?: IconProp): JSX.Element | undefined {
  if(typeof icon === 'string') {
    if(icon in icons) {
      return createElement(icons[icon]);
    }

    console.warn(`Tried to access invalid icon '${icon}'`);
    return undefined;
  }

  return icon;
}

// re-export icon component
export * from './Icon';
