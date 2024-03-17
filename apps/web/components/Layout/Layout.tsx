import type { FC, ReactNode } from 'react';
import styles from './Layout.module.css';
import { Icon } from '@gw2treasures/ui';
import Navigation from './Header/Navigation';
import Link from 'next/link';
import { Search } from '../Search/Search';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { LanguageDropdown } from './Header/LanguageDropdown';
import { Menu } from './Header/Menu';
import { getTranslate, translateMany } from '@/lib/translate';
import { ReviewCountBadge } from './Header/ReviewCountBadge';
import { UserButton } from './Header/UserButton';
import { translations as itemTypeTranslations } from '../Item/ItemType.translations';
import { Rarity } from '@gw2treasures/database';
import { LiveUpdateStatus } from './Header/LiveUpdateStatus';

interface LayoutProps {
  children: ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  const t = getTranslate();

  const searchTranslations = translateMany([
    'search.placeholder',
    'search.results.items',
    'search.results.skills',
    'search.results.skins',
    'search.results.achievements',
    'search.results.achievements.categories',
    'search.results.achievements.groups',
    'search.results.builds',
    'search.results.pages',
    ...itemTypeTranslations.short,
    ...Object.values(Rarity).map((rarity) => `rarity.${rarity}` as const)
  ]);

  return (
    <div>
      <div className={styles.layout}>
        <Menu navigation={<Navigation/>}>
          <Link href="/" className={styles.title}>
            <Icon icon="gw2t"/>
            <span>gw2treasures.com</span>
          </Link>
          <Search translations={searchTranslations}/>
          <LiveUpdateStatus/>
          <div className={styles.right}>
            <LinkButton appearance="menu" href="/review">
              <Icon icon="review-queue"/><span className={styles.responsive}> Review<ReviewCountBadge/></span>
            </LinkButton>
            <LanguageDropdown/>
            <UserButton/>
          </div>
        </Menu>
        <hr className={styles.headerShadow}/>
        {children}
        <footer className={styles.footer}>
          <span><b>gw2treasures.com</b> by darthmaim &copy; {new Date().getFullYear()}</span>
          <div className={styles.footerLinks}>
            <Link href="/about">About</Link> /
            <Link href="/about/legal">Legal</Link> /
            <Link href="/about/privacy">Privacy</Link> /
            <Link href="/status">Status</Link> /
            <ExternalLink href="https://discord.gg/gvx6ZSE" target="_blank">Discord</ExternalLink>
          </div>
        </footer>
      </div>
      <div className={styles.disclaimer} data-nosnippet>This site is not affiliated with ArenaNet, Guild Wars 2, or any of their partners. All copyrights reserved to their respective owners.</div>
      <div className={styles.disclaimer} data-nosnippet>© 2014 ArenaNet, Inc. All rights reserved. NCsoft, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions, Guild Wars Nightfall, Guild Wars: Eye of the North, Guild Wars 2, and all associated logos and designs are trademarks or registered trademarks of NCsoft Corporation. All other trademarks are the property of their respective owners.</div>
    </div>
  );
};

export default Layout;
