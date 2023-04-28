import { Item } from '@gw2treasures/database';
import { Headline } from '@gw2treasures/ui';
import { ItemTable } from '@/components/Item/ItemTable';
import { getSimilarItems } from './data';

export async function SimilarItems({ item }: { item: Item }) {
  const similarItems = await getSimilarItems(item);

  return similarItems.length > 0 && (
    <>
      <Headline id="similar">Similar Items</Headline>
      <ItemTable items={similarItems}/>
    </>
  );
}
