'use client';

import type { FC, ReactNode } from 'react';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import styles from './Navigation.module.css';
import { CompositeItem } from '@gw2treasures/ui/components/Focus/Composite';
import type { IconProp } from '@gw2treasures/ui';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';

interface NavigationItemProps {
  children: ReactNode;
  dropDown?: ReactNode;
  href: string;
  icon: IconProp;
}

export const NavigationItem: FC<NavigationItemProps> = ({ dropDown, ...props }) => {
  return (
    <li className={styles.item}>
      {dropDown ? (
        <DropDown hover hideTop={false} button={<CompositeItem render={<LinkButton appearance="menu" {...props}/>}/>}>
          {dropDown}
        </DropDown>
      ) : (
        <CompositeItem render={<LinkButton appearance="menu" {...props}/>}/>
      )}
    </li>
  );
};

