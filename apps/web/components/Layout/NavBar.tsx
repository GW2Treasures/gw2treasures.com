'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import styles from './NavBar.module.css';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { HorizontalOverflowContainer } from '@/components/Layout/HorizontalOverflowContainer';
import { Composite, CompositeItem } from '@floating-ui/react';
import type { IconProp } from '@gw2treasures/ui';

interface NavBarProps {
  items: { label: ReactNode, segment: string, href?: string, icon?: IconProp }[]
  base?: '/' | `/${string}/`;
}

export const NavBar: FC<NavBarProps> = ({ items, base = '/' }) => {
  const segment = useSelectedLayoutSegments().join('/');

  return (
    <div className={styles.bar}>
      <HorizontalOverflowContainer inverted>
        <Composite render={<ul className={styles.list}/>}>
          {items.map((item) => (
            <li key={item.segment} className={segment === item.segment ? styles.active : styles.button}>
              <CompositeItem render={<LinkButton href={item.href ?? (base + item.segment)} appearance="menu" className={styles.link} icon={item.icon}/>}>
                {item.label}
              </CompositeItem>
            </li>
          ))}
        </Composite>
      </HorizontalOverflowContainer>
    </div>
  );
};
