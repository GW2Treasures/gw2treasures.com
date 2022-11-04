import { createElement, FunctionComponent, SVGProps } from 'react';
import MenuIcon from './menu.svg';
import GW2TreasuresIcon from './gw2t.svg';
import UserIcon from './user.svg';
import RevisionIcon from './revision.svg';
import SearchIcon from './search.svg';
import ChevronDownIcon from './chevronDown.svg';

export type IconName = 'menu' | 'gw2treasures' | 'user' | 'revision' | 'search' | 'chevronDown';

type IconComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

export const Icons: Record<IconName, IconComponent> = {
  'menu': MenuIcon,
  'gw2treasures': GW2TreasuresIcon,
  'user': UserIcon,
  'revision': RevisionIcon,
  'search': SearchIcon,
  'chevronDown': ChevronDownIcon,
};

export type Icon = IconName | JSX.Element;

export function getIcon(icon?: Icon): JSX.Element | undefined {
  return icon
    ? ((typeof icon === 'string' && icon in Icons) ? createElement(Icons[icon as IconName]) : icon as JSX.Element)
    : undefined;
}
