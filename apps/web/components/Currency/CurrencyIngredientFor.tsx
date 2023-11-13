import { RecipeTable } from '../Recipe/RecipeTable';
import { db } from '@/lib/prisma';
import type { AsyncComponent } from '@/lib/asyncComponent';
import 'server-only';
import { remember } from '@/lib/remember';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';

const getIngredientForCurrency = remember(60, async function getIngredientForCurrency(currencyId: number) {
  const recipes = await db.recipe.findMany({
    where: { currencyIngredients: { some: { currencyId }}},
    select: {
      id: true,
      rating: true,
      disciplines: true,
      outputCount: true,
      currentRevision: { select: { data: true }},
      outputItem: { select: linkProperties },
      itemIngredients: { select: { count: true, Item: { select: linkProperties }}},
      currencyIngredients: { select: { count: true, Currency: { select: linkPropertiesWithoutRarity }}},
      unlockedByItems: { select: linkProperties }
    }
  });

  return recipes;
});

interface CurrencyIngredientForProps {
  currencyId: number;
};

export const CurrencyIngredientFor: AsyncComponent<CurrencyIngredientForProps> = async ({ currencyId }) => {
  const recipes = await getIngredientForCurrency(currencyId);

  return (
    <RecipeTable recipes={recipes}/>
  );
};
