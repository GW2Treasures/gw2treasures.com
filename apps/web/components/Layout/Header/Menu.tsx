'use client';

import { Icon } from '@gw2treasures/ui';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import styles from '../Layout.module.css';

export interface MenuProps {
  children: ReactNode;
  navigation: ReactNode;
}

export const Menu: FC<MenuProps> = ({ children, navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState('window' in global && window.scrollY > 0);

  useEffect(() => {
    const listener = () => {
      setScrolledDown(window.scrollY > 0);
    };
    window.addEventListener('scroll', listener, { passive: true });
    return () => window.removeEventListener('scroll', listener);
  }, []);

  useEffect(() => {
    if(!scrolledDown && menuOpen) {
      setMenuOpen(false);
    }
  }, [menuOpen, scrolledDown]);

  return (
    <div className={styles.header}>
      <header className={scrolledDown ? styles.headerMainScrolled : styles.headerMain} suppressHydrationWarning>
        <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)} tabIndex={-1}>
          <Icon icon="menu"/>
        </button>
        {children}
      </header>

      <nav className={menuOpen ? styles.headerNavVisible : styles.headerNav}>
        {navigation}
      </nav>
    </div>
  );
};
