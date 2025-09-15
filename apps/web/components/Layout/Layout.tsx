import type { FC, ReactNode } from 'react';
import styles from './Layout.module.css';
import { Icon } from '@gw2treasures/ui';
import Navigation from './Header/Navigation';
import Link from 'next/link';
import { Search } from '../Search/Search';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { LanguageDropdown } from './Header/LanguageDropdown';
import { Menu } from './Header/Menu';
import { translateMany } from '@/lib/translate';
import { UserButton } from './Header/UserButton';
import { translations as itemTypeTranslations } from '../Item/ItemType.translations';
import { Language, MasteryRegion, Rarity } from '@gw2treasures/database';
import { currencyCategories, type CurrencyCategoryName } from '@gw2treasures/static-data/currencies/categories';
import { ReviewButton } from './Header/ReviewButton';
import { PartnerButton } from './partner/button';
import { PartnerLogo } from './partner/logo';

interface LayoutProps {
  children: ReactNode,
  language: Language,
}

const Layout: FC<LayoutProps> = ({ children, language }) => {
  const searchTranslations = translateMany([
    'search.placeholder',
    'search.results.items',
    'search.results.skills',
    'search.results.traits',
    'search.results.professions',
    'search.results.skins',
    'search.results.achievements',
    'search.results.achievements.categories',
    'search.results.achievements.groups',
    'search.results.currencies',
    'search.results.builds',
    'search.results.pages',
    ...itemTypeTranslations.short,
    ...Object.values(Rarity).map((rarity) => `rarity.${rarity}` as const),
    'weight.Clothing', 'weight.Heavy', 'weight.Light', 'weight.Medium',
    ...Object.keys(currencyCategories).map((category) => `currency.category.${category as CurrencyCategoryName}` as const),
    ...Object.values(MasteryRegion).map((mastery) => `mastery.${mastery}` as const),
    'trait.tier.1', 'trait.tier.2', 'trait.tier.3', 'trait.slot.Minor', 'trait.slot.Major',
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
            <PartnerButton/>
            <ReviewButton language={language}/>
            <LanguageDropdown/>
            <UserButton language={language}/>
          </div>
        </Menu>
        <hr className={styles.headerShadow}/>
        {children}
        <footer className={styles.footer} data-nosnippet>
          <div className={styles.footerLeft}>
            <Link href="/about#partner">
              <PartnerLogo/>
            </Link>
            <span><b>gw2treasures.com</b> by darthmaim &copy; {new Date().getFullYear()}</span>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/about">About</Link> /
            <Link href="/about/legal">Legal</Link> /
            <Link href="/about/privacy">Privacy</Link> /
            <Link href="/status">Status</Link> /
            <ExternalLink href="https://ko-fi.com/darthmaim">Donate</ExternalLink> /
            <ExternalLink href="https://bsky.app/profile/gw2treasures.com">Bluesky</ExternalLink> /
            <ExternalLink href="https://discord.gg/gvx6ZSE">Discord</ExternalLink>
          </div>
        </footer>
      </div>
      <div className={styles.disclaimer} data-nosnippet>© ArenaNet LLC. All rights reserved. NCSOFT, ArenaNet, Guild Wars, Guild Wars 2, GW2, Guild Wars 2: Heart of Thorns, Guild Wars 2: Path of Fire, Guild Wars 2: End of Dragons, and Guild Wars 2: Secrets of the Obscure and all associated logos, designs, and composite marks are trademarks or registered trademarks of NCSOFT Corporation.</div>
    </div>
  );
};

export default Layout;
