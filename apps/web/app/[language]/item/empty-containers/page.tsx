import { remember } from '@/lib/remember';
import { db } from '@/lib/prisma';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemTable } from '@/components/Item/ItemTable';

const getEmptyContainers = remember(60 * 10, async function getEmptyContainers() {
  const items = await db.item.findMany({
    where: { type: 'Container', contains: { none: {}}, containsCurrency: { none: {}}},
    include: { icon: true },
    take: 500,
  });

  return items;
});

export default async function ItemEmptyContainersPage() {
  const items = await getEmptyContainers();

  return (
    <PageLayout>
      <Headline id="empty">Empty Containers</Headline>

      <p>This page shows all container items that don&apos;t have any contents (limited to 500). You can help by adding the content on the item page.</p>

      <ItemTable items={items} limit={Infinity}/>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Empty Containers'
};
