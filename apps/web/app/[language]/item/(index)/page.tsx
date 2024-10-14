import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import type { Language } from '@gw2treasures/database';
import { linkProperties } from '@/lib/linkProperties';
import { ItemLink } from '@/components/Item/ItemLink';
import { FormatDate } from '@/components/Format/FormatDate';
import { pageView } from '@/lib/pageView';
import { cache } from '@/lib/cache';
import type { PageProps } from '@/lib/next';

const getItems = cache(async (language: Language) => {
  const [recentlyAdded, recentlyUpdated] = await Promise.all([
    db.item.findMany({
      select: { ...linkProperties, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 48,
    }),
    db.revision.findMany({
      where: { entity: 'Item', type: 'Update', language },
      select: { id: true, createdAt: true, itemHistory: { select: { item: { select: linkProperties }}}},
      orderBy: { createdAt: 'desc' },
      take: 48,
    })
  ]);

  return { recentlyAdded, recentlyUpdated };
}, ['items'], { revalidate: 60 });

export default async function ItemPage({ params }: PageProps) {
  const { language } = await params;
  const { recentlyAdded, recentlyUpdated } = await getItems(language);
  pageView('item');

  return (
    <HeroLayout hero={<Headline id="items">Items</Headline>} toc>
      <Headline id="recent">Recently added</Headline>
      <ItemList>
        {recentlyAdded.map((item) => <li key={item.id}><ItemLink item={item}/><FormatDate date={item.createdAt} relative/></li>)}
      </ItemList>
      <Headline id="updated">Recently updated</Headline>
      <ItemList>
        {recentlyUpdated.map((revision) => <li key={revision.id}><ItemLink item={revision.itemHistory!.item}/><FormatDate date={revision.createdAt} relative/></li>)}
      </ItemList>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Items'
};
