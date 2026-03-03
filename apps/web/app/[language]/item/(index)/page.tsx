import { FormatDate } from '@/components/Format/FormatDate';
import { ItemLink } from '@/components/Item/ItemLink';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { SkeletonLink } from '@/components/Link/SkeletonLink';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { createMetadata } from '@/lib/metadata';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getLanguage } from '@/lib/translate';
import type { Language } from '@gw2treasures/database';
import { range } from '@gw2treasures/helper/range';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Suspense } from 'react';

const getRecentlyAddedItems = cache(() => {
  return db.item.findMany({
    select: { ...linkProperties, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 48,
  });
}, ['items:recently-added'], { revalidate: 60 });

const getRecentlyUpdatedItems = cache((language: Language) => {
  return db.revision.findMany({
    where: { entity: 'Item', type: 'Update', language },
    select: { id: true, createdAt: true, itemHistory: { select: { item: { select: linkProperties }}}},
    orderBy: { createdAt: 'desc' },
    take: 48,
  });
}, ['items:recently-updated'], { revalidate: 60 * 5 });

export default async function ItemPage() {
  const language = await getLanguage();
  pageView('item');

  return (
    <HeroLayout hero={<Headline id="items">Items</Headline>} toc>
      <Headline id="recent">Recently added</Headline>
      <Suspense fallback={<SkeletonList/>}>
        <RecentlyAddedList/>
      </Suspense>
      <Headline id="updated">Recently updated</Headline>
      <Suspense fallback={<SkeletonList/>}>
        <RecentlyUpdatedList language={language}/>
      </Suspense>
    </HeroLayout>
  );
}

const SkeletonList = () => (
  <ItemList>
    {range(48).map((i) => (
      <li key={i}><SkeletonLink/></li>
    ))}
  </ItemList>
);

async function RecentlyAddedList() {
  const recentlyAdded = await getRecentlyAddedItems();

  return (
    <ItemList>
      {recentlyAdded.map((item) => <li key={item.id}><ItemLink item={item}/><FormatDate date={item.createdAt} relative/></li>)}
    </ItemList>
  );
}

async function RecentlyUpdatedList({ language }: { language: Language }) {
  const recentlyUpdated = await getRecentlyUpdatedItems(language);

  return (
    <ItemList>
      {recentlyUpdated.map((revision) => <li key={revision.id}><ItemLink item={revision.itemHistory!.item}/><FormatDate date={revision.createdAt} relative/></li>)}
    </ItemList>
  );
}

export const generateMetadata = createMetadata({
  title: 'Items'
});
