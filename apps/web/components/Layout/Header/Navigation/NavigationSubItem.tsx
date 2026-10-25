'use client';

import { useListItem } from '@floating-ui/react';
import type { IconProp } from '@gw2treasures/ui';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { use, type FC, type ReactNode } from 'react';
import { NavigationMenuContext } from './NavigationMenuContext';

export interface NavigationSubItemProps {
  href: string,
  icon?: IconProp,
  children: ReactNode,
}

export const NavigationSubItem: FC<NavigationSubItemProps> = ({ href, icon, children }) => {
  const menu = use(NavigationMenuContext);
  const { ref, index } = useListItem();

  if(!menu) {
    throw new Error('NavigationSubItem must be used inside the menu of a NavigationItem');
  }

  const isActive = menu.activeIndex === index;

  return (
    <LinkButton
      ref={ref}
      href={href}
      icon={icon}
      appearance="menu"
      {...menu.getItemProps({ role: 'menuitem', tabIndex: isActive ? 0 : -1, onClick: menu.close })}
    >
      {children}
    </LinkButton>
  );
};
