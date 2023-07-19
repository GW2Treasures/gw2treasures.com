import { ItemTable } from '@/components/ItemTable/ItemTable';
import { ItemTableColumnsButton } from '@/components/ItemTable/ItemTableColumnsButton';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { Item } from '@gw2treasures/database';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export function SimilarItems({ item }: { item: Item }) {
  const query = {
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
    }
  };

  return (
    <ItemTableContext>
      <Headline id="similar" actions={<ItemTableColumnsButton/>}>Similar Items</Headline>
      <ItemTable query={query} collapsed/>
    </ItemTableContext>
  );
}
