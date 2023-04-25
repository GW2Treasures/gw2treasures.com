import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@/components/Headline/Headline';
import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { SkeletonLink } from '@/components/Link/SkeletonLink';
import { Search } from '@/components/Search/Search';
import { Suspense } from 'react';
import Icon from '../../../icons/Icon';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';
import styles from './page.module.css';
import Link from 'next/link';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { AchievementLink } from '@/components/Achievement/AchievementLink';

export const dynamic = 'force-dynamic';

function HomePage() {
  return (
    <HeroLayout hero={(
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTitle}><Icon icon="gw2treasures"/> gw2treasures.com</div>
          <div className={styles.heroSubtitle}>The Guild Wars 2® Database</div>
        </div>
      </div>
    )}
    >
      <Suspense fallback={<div className={styles.statsRow}/>}>
        {/* @ts-expect-error Server Component */}
        <DbStats/>
      </Suspense>

      <Headline id="new-items">
        <Trans id="items.new"/>
      </Headline>
      <Suspense fallback={<ListFallback size={24}/>}>
        {/* @ts-expect-error Server Component */}
        <NewItems/>
      </Suspense>

      <Headline id="new-achievements">
        New Achievements
      </Headline>
      <Suspense fallback={<ListFallback size={24}/>}>
        {/* @ts-expect-error Server Component */}
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

const getNewItems = remember(15, function getNewItems() {
  return db.item.findMany({ take: 24, include: { icon: true }, orderBy: { createdAt: 'desc' }});
});

async function NewItems() {
  const items = await getNewItems();

  return (
    <ItemList>
      {items.map((item) => <li key={item.id}><ItemLink item={item}/><FormatDate date={item.createdAt} relative data-superjson/></li>)}
    </ItemList>
  );
}

const getNewAchievements = remember(15, function getNewItems() {
  return db.achievement.findMany({ take: 24, include: { icon: true }, orderBy: { createdAt: 'desc' }});
});

async function NewAchievements() {
  const achievements = await getNewAchievements();

  return (
    <ItemList>
      {achievements.map((achievement) => <li key={achievement.id}><AchievementLink achievement={achievement}/><FormatDate date={achievement.createdAt} relative data-superjson/></li>)}
    </ItemList>
  );
}

const getDbStats = remember(15, async function getDbStats() {
  const [items, achievements, skills, skins] = await Promise.all([
    db.item.count(),
    db.achievement.count(),
    db.skill.count(),
    db.skin.count(),
  ]);

  return { items, achievements, skills, skins };
});

async function DbStats() {
  const counts = await getDbStats();

  return (
    <div className={styles.statsRow}>
      <Link href="/item" className={styles.stat}><span className={styles.statCount}><FormatNumber value={counts.items}/></span> Items</Link>
      <Link href="/skin" className={styles.stat}><span className={styles.statCount}><FormatNumber value={counts.skins}/></span> Skins</Link>
      <Link href="/skill" className={styles.stat}><span className={styles.statCount}><FormatNumber value={counts.skills}/></span> Skills</Link>
      <Link href="/achievement" className={styles.stat}><span className={styles.statCount}><FormatNumber value={counts.achievements}/></span> Achievements</Link>
    </div>
  );
}

export default HomePage;

export const metadata = {
  title: 'Home'
};
