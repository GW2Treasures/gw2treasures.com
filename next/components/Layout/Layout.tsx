'use client';

import { FunctionComponent, ReactNode, useCallback, useEffect, useState } from 'react';
import styles from './Layout.module.css';
import Icon from '../../icons/Icon';
import Navigation from './Navigation';
import Link from 'next/link';
import { Search } from '../Search/Search';
import LoaderIcon from './loader.svg';
import { useLoading } from '../../lib/useLoading';
import { useRouter } from 'next/navigation';
import { Button, LinkButton } from '../Form/Button';
import { DropDown } from '../DropDown/DropDown';
import { Separator } from './Separator';
import { MenuList } from '../MenuList/MenuList';
import { Radiobutton } from '../Form/Radiobutton';
import { Dialog } from '../Dialog/Dialog';
import { FormatDate } from '../Format/FormatDate';
import { FormatNumber } from '../Format/FormatNumber';
import { useFormatContext } from '../Format/FormatContext';
import { useLanguage } from '../I18n/Context';
import { Language } from '@prisma/client';
import { ExternalLink } from '../Link/ExternalLink';
import { FormatConfigDialog } from '../Format/FormatConfigDialog';

interface LayoutProps {
  children: ReactNode;
};

const languages = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
};

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState('window' in global && window.scrollY > 0);
  const loading = useLoading();
  const { push } = useRouter();

  const [formatDialogOpen, setFormatDialogOpen] = useState(false);

  const language = useLanguage();
  const localeName = languages[language];

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

  const changeLanguage = useCallback((language: Language) => {
    const url = new URL(window.location.href);
    url.hostname = language + url.hostname.substring(2);
    // window.location.href = url.href;
    push(url.href);
  }, [push]);

  return (
    <div>
      <div className={styles.layout}>
        <div className={styles.header}>
          <header className={scrolledDown ? styles.headerMainScrolled : styles.headerMain} suppressHydrationWarning>
            <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
              <Icon icon="menu"/>
            </button>
            <Link href="/" className={styles.title}>
              <Icon icon="gw2treasures"/>
              {loading && (<LoaderIcon className={styles.loader}/>)}
              <span>gw2treasures.com</span>
            </Link>
            <Search/>
            <div className={styles.right}>
              <DropDown hideTop={false} preferredPlacement="bottom" button={(
                <Button appearance="menu">
                  <Icon icon="locale"/><span className={styles.responsive}> {localeName}</span>
                </Button>
              )}
              >
                <MenuList>
                  <Radiobutton checked={language === 'de'} onChange={() => changeLanguage('de')}>{languages.de}</Radiobutton>
                  <Radiobutton checked={language === 'en'} onChange={() => changeLanguage('en')}>{languages.en}</Radiobutton>
                  <Radiobutton checked={language === 'es'} onChange={() => changeLanguage('es')}>{languages.es}</Radiobutton>
                  <Radiobutton checked={language === 'fr'} onChange={() => changeLanguage('fr')}>{languages.fr}</Radiobutton>
                  <Separator/>
                  <Button onClick={() => setFormatDialogOpen(true)} appearance="menu">Formatting Settings…</Button>
                </MenuList>
              </DropDown>
              <FormatConfigDialog open={formatDialogOpen} onClose={() => setFormatDialogOpen(false)}/>

              <LinkButton appearance="menu" href="/login">
                <Icon icon="user"/><span className={styles.responsive}> Login</span>
              </LinkButton>
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
          <div className={styles.footerLinks}>
            <Link href="/about">About</Link>
            <Link href="/status">Status</Link>
            <ExternalLink href="https://discord.gg/gvx6ZSE" target="_blank">Discord</ExternalLink>
          </div>
        </footer>
      </div>
      <div className={styles.disclaimer}>This site is not affiliated with ArenaNet, Guild Wars 2, or any of their partners. All copyrights reserved to their respective owners.</div>
      <div className={styles.disclaimer}>© 2014 ArenaNet, Inc. All rights reserved. NCsoft, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions, Guild Wars Nightfall, Guild Wars: Eye of the North, Guild Wars 2, and all associated logos and designs are trademarks or registered trademarks of NCsoft Corporation. All other trademarks are the property of their respective owners.</div>
    </div>
  );
};

export default Layout;
