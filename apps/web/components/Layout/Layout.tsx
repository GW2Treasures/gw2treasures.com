import type { ReactNode } from 'react';
import styles from './Layout.module.css';
import { Icon } from '@gw2treasures/ui';
import Navigation from './Header/Navigation';
import Link from 'next/link';
import { Search, type SearchProps } from '../Search/Search';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { LanguageDropdown } from './Header/LanguageDropdown';
import { Menu } from './Header/Menu';
import type { AsyncComponent } from '@/lib/asyncComponent';
import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { getTranslate } from '../I18n/getTranslate';
import cakeImg from './cake.png';
import { cache } from '@/lib/cache';
import { minutes } from '@/lib/time';

interface LayoutProps {
  children: ReactNode;
};

const getOpenReviews = cache(
  () => db.review.count({ where: { state: 'Open' }}),
  ['open-reviews'],
  { revalidate: minutes(10).seconds }
);

const Layout: AsyncComponent<LayoutProps> = async ({ children }) => {
  const user = await getUser();
  const openReviews = await getOpenReviews();
  const t = getTranslate();

  const searchTranslations: SearchProps['translations'] = {
    placeholder: t('search.placeholder'),
    items: t('search.results.items'),
    skills: t('search.results.skills'),
    skins: t('search.results.skins'),
    achievements: t('search.results.achievements'),
    'achievements.categories': t('search.results.achievements.categories'),
    'achievements.groups': t('search.results.achievements.groups'),
    builds: t('search.results.builds'),
    pages: t('search.results.pages'),
  };

  return (
    <div>
      <div className={styles.layout}>
        <Menu navigation={<Navigation/>}>
          <Link href="/" className={styles.title}>
            <Icon icon="gw2t"/>
            <span>gw2treasures.com</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.cake} src={cakeImg.src} alt="" width={24} height={24}/>
          </Link>
          <Search translations={searchTranslations}/>
          <div className={styles.right}>
            <LinkButton appearance="menu" href="/review">
              <Icon icon="review-queue"/><span className={styles.responsive}> Review {openReviews > 0 && (<span className={styles.badge}>{openReviews}</span>)}</span>
            </LinkButton>
            <LanguageDropdown/>
            {user ? (
              <LinkButton appearance="menu" href="/profile">
                <Icon icon="user"/><span className={styles.responsive}> {user.name}</span>
              </LinkButton>
            ) : (
              <LinkButton appearance="menu" href="/login">
                <Icon icon="user"/><span className={styles.responsive}> Login</span>
              </LinkButton>
            )}
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
      <div className={styles.disclaimer}>This site is not affiliated with ArenaNet, Guild Wars 2, or any of their partners. All copyrights reserved to their respective owners.</div>
      <div className={styles.disclaimer}>© 2014 ArenaNet, Inc. All rights reserved. NCsoft, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions, Guild Wars Nightfall, Guild Wars: Eye of the North, Guild Wars 2, and all associated logos and designs are trademarks or registered trademarks of NCsoft Corporation. All other trademarks are the property of their respective owners.</div>
    </div>
  );
};

export default Layout;
