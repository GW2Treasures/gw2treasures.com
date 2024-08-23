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
import { translateMany } from '@/lib/translate';
import { ReviewCountBadge } from './Header/ReviewCountBadge';
import { UserButton } from './Header/UserButton';
import { translations as itemTypeTranslations } from '../Item/ItemType.translations';
import { Language, Rarity } from '@gw2treasures/database';
import { FormatDate } from '../Format/FormatDate';

interface LayoutProps {
  children: ReactNode;
  language: Language;
}

const Layout: FC<LayoutProps> = ({ children, language }) => {
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
    ...Object.values(Rarity).map((rarity) => `rarity.${rarity}` as const),
    'weight.Clothing', 'weight.Heavy', 'weight.Light', 'weight.Medium'
  ], language);

  return (
    <div>
      <div className={styles.layout}>
        <Menu navigation={<Navigation language={language}/>}>
          <Link href="/" className={styles.title} aria-label="gw2treasures.com">
            <Icon icon="gw2t"/>
            <span>gw2treasures.com</span>
          </Link>
          <Search translations={searchTranslations}/>
          <div className={styles.right}>
            <LinkButton appearance="menu" href="/review" aria-label="Review">
              <Icon icon="review-queue"/><span className={styles.responsive}> Review<ReviewCountBadge/></span>
            </LinkButton>
            <LanguageDropdown/>
            <UserButton language={language}/>
          </div>
        </Menu>
        <aside data-nosnippet="true" style={{ gridArea: 'notification', padding: 16, lineHeight: 1.5, background: '#03a9f422', marginTop: -1, borderBottom: '1px solid var(--color-border-transparent)' }}>
          <b>The official Guild Wars 2 API will be disabled</b> starting <FormatDate date={new Date('2024-08-16T17:00:00.000Z')}/> until
          after the launch of <b style={{ whiteSpace: 'nowrap' }}>Guild Wars 2: Janthir Wilds.</b><br/>
          New items, achievements, skills, and others will only be available after the API has been re-enabled.<br/>
          It will not be possible to access your account info (like inventories, achievements, ...) during this time.
        </aside>
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
