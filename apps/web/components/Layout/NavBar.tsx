'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import styles from './NavBar.module.css';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { HorizontalOverflowContainer } from '@/components/Layout/HorizontalOverflowContainer';

interface NavBarProps {
  items: { label: ReactNode, segment: string }[]
  base?: '/' | `/${string}/`;
}

export const NavBar: FC<NavBarProps> = ({ items, base = '/' }) => {
  const segment = useSelectedLayoutSegments().join('/');

  return (
    <div className={styles.bar}>
      <HorizontalOverflowContainer inverted>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.segment} className={segment === item.segment ? styles.active : styles.button}>
              <LinkButton href={base + item.segment} appearance="menu" className={styles.link}>
                {item.label}
              </LinkButton>
            </li>
          ))}
        </ul>
      </HorizontalOverflowContainer>
    </div>
  );
};
