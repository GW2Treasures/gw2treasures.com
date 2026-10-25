'use client';

import { Icon } from '@gw2treasures/ui';
import { type FC, type FocusEvent, type ReactNode, useCallback, useRef, useState, useSyncExternalStore } from 'react';
import styles from '../Layout.module.css';

export interface MenuProps {
  children: ReactNode,
  navigation: ReactNode,
}

const getScrolledDown = () => window.scrollY > 0;
const getServerScrolledDown = () => false;

export const Menu: FC<MenuProps> = ({ children, navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Whether keyboard focus is somewhere in the navigation (including submenus). While the header is scrolled out of
  // view, this slides the navigation in.
  const [navFocused, setNavFocused] = useState(false);
  // Mirrors `navFocused` synchronously, so the deferred check in `handleNavBlur` can see focus moves that happened since.
  const focusInsideNav = useRef(false);

  // The server can't know the scroll position. Reading it with `useSyncExternalStore` makes React render the server
  // value first and then re-render with the real one when hydrating, so the markup is updated if the page was reloaded
  // while scrolled down (a plain `useState` initializer would leave the server markup untouched).
  const subscribeToScroll = useCallback((onChange: () => void) => {
    const listener = () => {
      onChange();

      // the opened menu is only available while scrolled down
      if(window.scrollY === 0) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('scroll', listener, { passive: true });
    return () => window.removeEventListener('scroll', listener);
  }, []);

  const scrolledDown = useSyncExternalStore(subscribeToScroll, getScrolledDown, getServerScrolledDown);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleNavFocus = (event: FocusEvent<HTMLElement>) => {
    focusInsideNav.current = true;

    // only show the navigation for keyboard focus, not for clicks
    if(event.target.matches(':focus-visible')) {
      setNavFocused(true);
    }
  };

  const handleNavBlur = () => {
    focusInsideNav.current = false;

    // Moving focus from one element to another fires a blur followed by a focus event. Hiding the navigation right away
    // would flash it (and restart its slide in animation) on every focus move, so wait until the focus has settled.
    // `relatedTarget` can't be used instead, because submenus are portaled outside of the `nav` in the DOM, but React
    // still bubbles their focus events to this handler.
    requestAnimationFrame(() => {
      if(!focusInsideNav.current) {
        setNavFocused(false);
      }
    });
  };

  return (
    <div className={styles.header}>
      <header className={scrolledDown ? styles.headerMainScrolled : styles.headerMain}>
        <button className={styles.menuButton} onClick={toggleMenu} tabIndex={-1} aria-label="Menu">
          <Icon icon="menu"/>
        </button>
        {children}
      </header>

      <nav
        className={menuOpen ? styles.headerNavVisible : navFocused && scrolledDown ? styles.headerNavFocused : styles.headerNav}
        onFocus={handleNavFocus}
        onBlur={handleNavBlur}
      >
        {navigation}
      </nav>
    </div>
  );
};
