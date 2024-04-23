import { RecipeTable } from '../Recipe/RecipeTable';
import { db } from '@/lib/prisma';
import 'server-only';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { cache } from '@/lib/cache';
import type { FC } from 'react';

const getIngredientFor = cache(async (itemId: number) => {
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
}, ['ingredients-for'], { revalidate: 60 });

interface ItemIngredientForProps {
  itemId: number;
};

export const ItemIngredientFor: FC<ItemIngredientForProps> = async ({ itemId }) => {
  const recipes = await getIngredientFor(itemId);

  return (
    <RecipeTable recipes={recipes}/>
  );
};
