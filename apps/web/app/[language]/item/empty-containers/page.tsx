import { ItemTable } from '@/components/ItemTable/ItemTable';
import { ItemTableColumnsButton } from '@/components/ItemTable/ItemTableColumnsButton';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { ItemTableQuery } from '@/components/ItemTable/types';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

const query: ItemTableQuery = {
  where: { type: 'Container', contains: { none: {}}, containsCurrency: { none: {}}},
};

export default function ItemEmptyContainersPage() {
  return (
    <PageLayout>
      <ItemTableContext id="emptyContainers">
        <Headline id="empty" actions={<ItemTableColumnsButton/>}>Empty Containers</Headline>
        <p>This page shows all container items that don&apos;t have any contents. You can help by adding the content on the item page.</p>

        <ItemTable query={query}/>
      </ItemTableContext>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Empty Containers'
};
