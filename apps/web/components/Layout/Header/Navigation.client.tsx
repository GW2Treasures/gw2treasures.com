'use client';

import { FC, ReactElement, ReactNode } from 'react';
import styles from './Navigation.module.css';
import { Composite, CompositeItem } from '@floating-ui/react';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { IconProp } from '@gw2treasures/ui';

export interface ClientNavigationProps {
  children: ReactElement<NavigationItemProps>[]
}

export const ClientNavigation: FC<ClientNavigationProps> = ({ children }) => {
  return (
    <Composite render={(<ul className={styles.navigation} role="menubar"/>)}>
      {children}
    </Composite>
  );
};

export interface NavigationItemProps {
  href: string;
  icon: IconProp;
  children: ReactNode;
}

export const NavigationItem: FC<NavigationItemProps> = ({ href, icon, children }) => {
  return (
    <CompositeItem render={(
      <LinkButton appearance="menu" href={href} icon={icon}>{children}</LinkButton>
    )}/>
  );
};
