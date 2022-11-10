import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import styles from './Layout.module.css';
import Icon from '../../icons/Icon';
import Navigation from './Navigation';
import Link from 'next/link';
import { Search } from '../Search/Search';

interface LayoutProps {
  children: ReactNode;
};

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
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
    <div>
      <div className={styles.layout}>
        <div className={styles.header}>
          <header className={scrolledDown ? styles.headerMainScrolled : styles.headerMain}>
            <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
              <Icon icon="menu"/>
            </button>
            <Link href="/" className={styles.title}>
              <Icon icon="gw2treasures"/>gw2treasures.com
            </Link>
            <Search/>
            <div className={styles.right}>
              <Icon icon="user"/> Login
            </div>
          </header>
          <nav className={menuOpen ? styles.headerNavVisible : styles.headerNav}>
            <Navigation/>
          </nav>
        </div>
        <hr className={styles.headerShadow}/>
        {children}
        <footer className={styles.footer}>
          <span><b>gw2treasures.com</b> by darthmaim &copy; {new Date().getFullYear()}</span>
          <Link href="/status/jobs">Status</Link>
        </footer>
      </div>
      <div className={styles.disclaimer}>This site is not affiliated with ArenaNet, Guild Wars 2, or any of their partners. All copyrights reserved to their respective owners.</div>
      <div className={styles.disclaimer}>© 2014 ArenaNet, Inc. All rights reserved. NCsoft, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions, Guild Wars Nightfall, Guild Wars: Eye of the North, Guild Wars 2, and all associated logos and designs are trademarks or registered trademarks of NCsoft Corporation. All other trademarks are the property of their respective owners.</div>
    </div>
  );
};

export default Layout;
