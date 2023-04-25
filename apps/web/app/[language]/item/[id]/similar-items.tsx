import { remember } from '@/lib/remember';
import { Item } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { Headline } from '@/components/Headline/Headline';
import { ItemTable } from '@/components/Item/ItemTable';

export const getSimilarItems = remember(60, async (item: Item) => {
  const similarItems = await db.item.findMany({
    where: {
      id: { not: item.id },
      OR: [
        { name_de: item.name_de },
        { name_en: item.name_en },
        { name_es: item.name_es },
        { name_fr: item.name_fr },
        { iconId: item.iconId },
        { unlocksSkinIds: { hasSome: item.unlocksSkinIds }},
        {
          type: item.type,
          subtype: item.subtype,
          rarity: item.rarity,
          weight: item.weight,
          value: item.value,
          level: item.level,
        }
      ]
    },
    include: { icon: true },
    take: 32,
  });

  return similarItems;
});

export async function SimilarItems({ item }: { item: Item }) {
  const similarItems = await getSimilarItems(item);

  return similarItems.length > 0 && (
    <>
      <Headline id="similar">Similar Items</Headline>
      <ItemTable items={similarItems}/>
    </>
  );
}
