import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { SkeletonLink } from '@/components/Link/SkeletonLink';
import { Suspense } from 'react';
import { Icon } from '@gw2treasures/ui';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';
import styles from './page.module.css';
import Link from 'next/link';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { pageView } from '@/lib/pageView';
import { cache } from '@/lib/cache';

async function HomePage() {
  await pageView('/');

  return (
    <HeroLayout hero={(
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.anniversary}>10 Years</div>
          <div className={styles.heroTitle}><Icon icon="gw2t"/> gw2treasures.com</div>
          <div className={styles.heroSubtitle}><Trans id="subtitle"/></div>
        </div>
      </div>
    )}
    >
      <Suspense fallback={<div className={styles.statsRow}/>}>
        <DbStats/>
      </Suspense>

      <p>Welcome to the new version of gw2treasures.com! Thank you for 10 years of support. This new version is a complete rewrite, so not all pages have been migrated yet. If you have feedback, find issues or have feature requests, please <Link href="/about">report them</Link> or even contribute yourself, everything is open-source.</p>

      <Headline id="new-items">
        <Trans id="items.new"/>
      </Headline>
      <Suspense fallback={<ListFallback size={24}/>}>
        <NewItems/>
      </Suspense>

      <Headline id="new-achievements">
        <Trans id="achievements.new"/>
      </Headline>
      <Suspense fallback={<ListFallback size={24}/>}>
        <NewAchievements/>
      </Suspense>
    </HeroLayout>
  );
};

function ListFallback({ size }: { size: number }) {
  return (
    <ItemList>
      {[...new Array(size)].map((_, id) => {
        // eslint-disable-next-line react/no-array-index-key
        return (<li key={id}><SkeletonLink/></li>);
      })}
    </ItemList>
  );
}

const getNewItems = cache(
  () => db.item.findMany({ take: 24, include: { icon: true }, orderBy: { createdAt: 'desc' }}),
  ['home-items-new'],
  { revalidate: 60 }
);

async function NewItems() {
  const items = await getNewItems();

  return (
    <ItemList>
      {items.map((item) => <li key={item.id}><ItemLink item={item}/><FormatDate date={item.createdAt} relative/></li>)}
    </ItemList>
  );
}

const getNewAchievements = cache(
  () => db.achievement.findMany({ take: 24, include: { icon: true }, orderBy: { createdAt: 'desc' }}),
  ['home-achievements-new'],
  { revalidate: 60 }
);

async function NewAchievements() {
  const achievements = await getNewAchievements();

  return (
    <ItemList>
      {achievements.map((achievement) => <li key={achievement.id}><AchievementLink achievement={achievement}/><FormatDate date={achievement.createdAt} relative/></li>)}
    </ItemList>
  );
}

const getDbStats = cache(async() => {
  const [items, achievements, skills, skins] = await Promise.all([
    db.item.count(),
    db.achievement.count(),
    db.skill.count(),
    db.skin.count(),
  ]);

  return { items, achievements, skills, skins };
}, ['home-db-stats'], { revalidate: 60 });

async function DbStats() {
  const counts = await getDbStats();

  return (
    <div className={styles.statsRow}>
      <Link href="/item" className={styles.stat}><span className={styles.statCount}><FormatNumber value={counts.items}/></span> <Trans id="navigation.items"/></Link>
      <Link href="/skin" className={styles.stat}><span className={styles.statCount}><FormatNumber value={counts.skins}/></span> <Trans id="navigation.skins"/></Link>
      <Link href="/skill" className={styles.stat}><span className={styles.statCount}><FormatNumber value={counts.skills}/></span> <Trans id="navigation.skills"/></Link>
      <Link href="/achievement" className={styles.stat}><span className={styles.statCount}><FormatNumber value={counts.achievements}/></span> <Trans id="navigation.achievements"/></Link>
    </div>
  );
}

export default HomePage;

export const metadata = {
  title: 'Home'
};
