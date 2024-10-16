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
import styles from './page.module.css';
import Link from 'next/link';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { cache } from '@/lib/cache';
import { getAlternateUrls } from '@/lib/url';
import { PageView } from '@/components/PageView/PageView';
import type { PageProps } from '@/lib/next';

async function HomePage({ params }: PageProps) {
  const { language } = await params;

  return (
    <HeroLayout hero={(
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTitle}><Icon icon="gw2t"/> gw2treasures.com</div>
          <div className={styles.heroSubtitle}><Trans language={language} id="subtitle"/></div>
        </div>
      </div>
    )}
    >
      <PageView page="/"/>
      <Suspense fallback={<div className={styles.statsRow}/>}>
        <DbStats/>
      </Suspense>

      <Headline id="new-items">
        <Trans language={language} id="items.new"/>
      </Headline>
      <Suspense fallback={<ListFallback size={24}/>}>
        <NewItems/>
      </Suspense>

      <Headline id="new-achievements">
        <Trans language={language} id="achievements.new"/>
      </Headline>
      <Suspense fallback={<ListFallback size={24}/>}>
        <NewAchievements/>
      </Suspense>
    </HeroLayout>
  );
}

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
      <Link href="/achievement" className={styles.stat}><span className={styles.statCount}><FormatNumber value={counts.achievements}/></span> <Trans id="navigation.achievements"/></Link>
      <Link href="/skin" className={styles.stat}><span className={styles.statCount}><FormatNumber value={counts.skins}/></span> <Trans id="navigation.skins"/></Link>
      <Link href="/skill" className={styles.stat}><span className={styles.statCount}><FormatNumber value={counts.skills}/></span> <Trans id="navigation.skills"/></Link>
    </div>
  );
}

export default HomePage;

export async function generateMetadata({ params }: PageProps) {
  const { language } = await params;

  return {
    title: 'Home',
    alternates: getAlternateUrls('/', language)
  };
}
