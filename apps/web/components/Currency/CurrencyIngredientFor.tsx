import { RecipeTable } from '../Recipe/RecipeTable';
import { db } from '@/lib/prisma';
import 'server-only';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { cache } from '@/lib/cache';
import type { FC } from 'react';

const getIngredientForCurrency = cache(async (currencyId: number) => {
  const recipes = await db.recipe.findMany({
    where: { ingredients: { some: { currencyId }}},
    select: {
      id: true,
      rating: true,
      disciplines: true,
      outputCount: true,
      outputItemId: true,
      outputItemIdRaw: true,
      ingredientCount: true,
      current: { select: { data: true }},
      outputItem: { select: linkProperties },
      ingredients: { include: { item: { select: linkProperties }, currency: { select: linkPropertiesWithoutRarity }, guildUpgrade: { select: linkPropertiesWithoutRarity }}},
      unlockedByItems: { select: linkProperties }
    }
  });

  return recipes;
}, ['ingredient-for-currency'], { revalidate: 60 });

interface CurrencyIngredientForProps {
  currencyId: number;
}

export const CurrencyIngredientFor: FC<CurrencyIngredientForProps> = async ({ currencyId }) => {
  const recipes = await getIngredientForCurrency(currencyId);

  return (
    <RecipeTable recipes={recipes}/>
  );
};
