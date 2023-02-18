import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import styles from './Layout.module.css';
import Icon from '../../icons/Icon';
import Navigation from './Navigation';
import Link from 'next/link';
import { Search } from '../Search/Search';
import LoaderIcon from './loader.svg';
import { useLoading } from '../../lib/useLoading';
import { useRouter } from 'next/router';
import { Button, LinkButton } from '../Form/Button';
import { DropDown } from '../DropDown/DropDown';
import { Separator } from './Separator';
import { MenuList } from '../MenuList/MenuList';
import { Radiobutton } from '../Form/Radiobutton';
import { Dialog } from '../Dialog/Dialog';
import { TextInput } from '../Form/TextInput';
import { FormatDate } from '../Format/FormatDate';
import { FormatNumber } from '../Format/FormatNumber';
import { useFormatContext } from '../Format/FormatContext';

interface LayoutProps {
  children: ReactNode;
};

const locales = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
};

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState('window' in global && window.scrollY > 0);
  const loading = useLoading();
  const { locale, asPath, replace } = useRouter();
  const { locale: formatLocale, setLocale: setFormatLocale, defaultLocale } = useFormatContext();

  const [formatDialogOpen, setFormatDialogOpen] = useState(false);

  const localeName = locale && locale in locales ? locales[locale as unknown as 'en'] : locales.en;

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
              <Icon icon="gw2treasures"/>
              {loading && (<LoaderIcon className={styles.loader}/>)}
              gw2treasures.com
            </Link>
            <Search/>
            <div className={styles.right}>
              <DropDown hideTop={false} preferredPlacement="bottom" button={(
                <Button appearance="menu">
                  <Icon icon="locale"/> {localeName}
                </Button>
              )}>
                <MenuList>
                  <Radiobutton checked={locale === 'de'} onChange={() => replace(asPath, undefined, { locale: 'de', scroll: false })}>{locales.de}</Radiobutton>
                  <Radiobutton checked={locale === 'en'} onChange={() => replace(asPath, undefined, { locale: 'en', scroll: false })}>{locales.en}</Radiobutton>
                  <Radiobutton checked={locale === 'es'} onChange={() => replace(asPath, undefined, { locale: 'es', scroll: false })}>{locales.es}</Radiobutton>
                  <Radiobutton checked={locale === 'fr'} onChange={() => replace(asPath, undefined, { locale: 'fr', scroll: false })}>{locales.fr}</Radiobutton>
                  <Separator/>
                  <Button onClick={() => setFormatDialogOpen(true)} appearance="menu">Formatting Settings…</Button>
                </MenuList>
              </DropDown>
              {formatDialogOpen && (
                <Dialog title="Formatting Settings" onClose={() => setFormatDialogOpen(false)}>
                  <MenuList>
                    <Radiobutton checked={formatLocale === undefined} onChange={() => setFormatLocale(undefined)}>Browser default ({defaultLocale})</Radiobutton>
                    {navigator.languages.filter((locale) => locale !== defaultLocale).map((locale) => (
                      <Radiobutton key={locale} checked={formatLocale === locale} onChange={() => setFormatLocale(locale)}>{locale}</Radiobutton>
                    ))}
                    <Separator/>
                    <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Date <FormatDate date={new Date()}/></div>
                    <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Relative Date <FormatDate relative date={new Date()}/></div>
                    <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Number <span><FormatNumber value={1234567.89}/></span></div>
                  </MenuList>
                </Dialog>
              )}
              <LinkButton appearance="menu" href="/login">
                <Icon icon="user"/> Login
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
          <Link href="/status/jobs">Status</Link>
        </footer>
      </div>
      <div className={styles.disclaimer}>This site is not affiliated with ArenaNet, Guild Wars 2, or any of their partners. All copyrights reserved to their respective owners.</div>
      <div className={styles.disclaimer}>© 2014 ArenaNet, Inc. All rights reserved. NCsoft, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions, Guild Wars Nightfall, Guild Wars: Eye of the North, Guild Wars 2, and all associated logos and designs are trademarks or registered trademarks of NCsoft Corporation. All other trademarks are the property of their respective owners.</div>
    </div>
  );
};

export default Layout;
