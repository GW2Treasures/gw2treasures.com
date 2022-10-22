import { FunctionComponent, ReactNode, useState } from 'react';
import styles from './Layout.module.css';
import Icon from '../../icons/Icon';
import Navigation from './Navigation';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
};

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <header className={styles.headerMain}>
          <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
            <Icon icon="menu"/>
          </button>
          <Icon icon="gw2treasures"/>
          <div className={styles.title}>
            <Link href="/">gw2treasures.com</Link>
          </div>
        </header>
        <nav className={menuOpen ? styles.headerNavVisible : styles.headerNav}>
          <Navigation/>
        </nav>
      </div>
      <hr className={styles.headerShadow}/>
        {children}
      <footer className={styles.footer}>Footer</footer>
    </div>
  );
};

export default Layout;
