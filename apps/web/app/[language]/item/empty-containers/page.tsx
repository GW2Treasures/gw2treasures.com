import { ItemTable } from '@/components/ItemTable/ItemTable';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

const query = {
  where: { type: 'Container', contains: { none: {}}, containsCurrency: { none: {}}},
  include: { icon: true },
  take: 500,
};

export default function ItemEmptyContainersPage() {
  return (
    <PageLayout>
      <Headline id="empty">Empty Containers</Headline>

      <p>This page shows all container items that don&apos;t have any contents. You can help by adding the content on the item page.</p>

      <ItemTable query={query}/>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Empty Containers'
};
