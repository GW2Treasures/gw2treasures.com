import { RecipeTable } from '../Recipe/RecipeTable';
import { db } from '@/lib/prisma';
import { AsyncComponent } from '@/lib/asyncComponent';
import 'server-only';
import { remember } from '@/lib/remember';

const getIngredientFor = remember(60, async function getIngredientFor(itemId: number) {
  const linkProperties = { id: true, icon: true, name_de: true, name_en: true, name_es: true, name_fr: true, rarity: true } as const;

  const recipes = await db.recipe.findMany({
    where: { itemIngredients: { some: { itemId }}},
    select: {
      id: true,
      rating: true,
      disciplines: true,
      currentRevision: { select: { data: true }},
      outputItem: { select: linkProperties },
      itemIngredients: { select: { count: true, Item: { select: linkProperties }}},
    }
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
