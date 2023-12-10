import { RecipeTable } from '../Recipe/RecipeTable';
import { db } from '@/lib/prisma';
import type { AsyncComponent } from '@/lib/asyncComponent';
import 'server-only';
import { remember } from '@/lib/remember';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';

const getIngredientFor = remember(60, async function getIngredientFor(itemId: number) {
  const recipes = await db.recipe.findMany({
    where: { itemIngredients: { some: { itemId }}},
    select: {
      id: true,
      rating: true,
      disciplines: true,
      outputCount: true,
      outputItemId: true,
      currentRevision: { select: { data: true }},
      outputItem: { select: linkProperties },
      itemIngredients: { select: { count: true, Item: { select: linkProperties }}},
      currencyIngredients: { select: { count: true, Currency: { select: linkPropertiesWithoutRarity }}},
      guildUpgradeIngredients: { select: { count: true, GuildUpgrade: { select: linkPropertiesWithoutRarity }}},
      unlockedByItems: { select: linkProperties }
    },
    orderBy: { outputItem: { views: 'desc' }}
  });

  return recipes;
});

interface ItemIngredientForProps {
  itemId: number;
};

export const ItemIngredientFor: AsyncComponent<ItemIngredientForProps> = async ({ itemId }) => {
  const recipes = await getIngredientFor(itemId);

  return (
    <RecipeTable recipes={recipes}/>
  );
};
