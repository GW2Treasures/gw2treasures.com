import { Trans } from '@/components/I18n/Trans';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { data, refinedMaterialItemIds, type Material } from 'app/[language]/homestead/materials/data';
import { loadItem } from '@/data/items';
import Link from 'next/link';
import type { FC } from 'react';
import { ItemLink } from '@/components/Item/ItemLink';

export interface HomesteadRefinedMaterialProps {
  itemId: number
}

export const HomesteadRefinedMaterial: FC<HomesteadRefinedMaterialProps> = async ({ itemId }) => {
  if(refinedMaterialItemIds.includes(itemId)) {
    return (
      <>
        <Headline id="homestead-material"><Trans id="homestead.materials"/></Headline>
        <p>This item is used to craft homestead decorations and can be obtained by refining common materials. Check <Link href="/homestead/materials">Homestead: Refined Materials</Link> to find the cheapest trade.</p>
      </>
    );
  }

  const refinedMaterialType: Material | undefined =
    data.fiber.sources[itemId] !== undefined ? 'fiber' :
    data.metal.sources[itemId] !== undefined ? 'metal' :
    data.wood.sources[itemId] !== undefined ? 'wood' :
    undefined;

  if(refinedMaterialType) {
    const refinedMaterialId = data[refinedMaterialType].itemId;
    const refinedMaterial = await loadItem(refinedMaterialId);

    if(!refinedMaterial) {
      return;
    }

    return (
      <>
        <Headline id="homestead-material"><Trans id="homestead.materials"/></Headline>
        <p>This item can be refined into <ItemLink item={refinedMaterial} icon={24}/>. Check <Link href={`/homestead/materials#${refinedMaterialType}`}>Homestead: Refined Materials</Link> to find the cheapest trade.</p>
      </>
    );
  }

  return null;
};
