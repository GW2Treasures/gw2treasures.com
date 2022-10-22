import { createElement, FunctionComponent, SVGProps } from 'react';
import MenuIcon from './menu.svg';
import GW2TreasuresIcon from './gw2t.svg';
import UserIcon from './user.svg';

export type IconName = 'menu' | 'gw2treasures' | 'user';

type IconComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

export const Icons: Record<IconName, IconComponent> = {
    'menu': MenuIcon,
    'gw2treasures': GW2TreasuresIcon,
    'user': UserIcon,
};
  
export type Icon = IconName | JSX.Element;

export function getIcon(icon?: Icon): JSX.Element | undefined {
  return icon
    ? ((typeof icon === 'string' && icon in Icons) ? createElement(Icons[icon as IconName]) : icon as JSX.Element)
    : undefined;
}
