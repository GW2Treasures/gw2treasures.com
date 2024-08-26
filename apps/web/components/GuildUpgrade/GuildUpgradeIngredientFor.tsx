import { RecipeTable } from '../Recipe/RecipeTable';
import { db } from '@/lib/prisma';
import 'server-only';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { cache } from '@/lib/cache';
import type { FC } from 'react';

const getIngredientForGuildUpgrade = cache(async (guildUpgradeId: number) => {
  const recipes = await db.recipe.findMany({
    where: { ingredients: { some: { guildUpgradeId }}},
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
}, ['ingredient-for-guild-upgrade'], { revalidate: 60 });

interface GuildUpgradeIngredientForProps {
  guildUpgradeId: number;
}

export const GuildUpgradeIngredientFor: FC<GuildUpgradeIngredientForProps> = async ({ guildUpgradeId }) => {
  const recipes = await getIngredientForGuildUpgrade(guildUpgradeId);

  return (
    <RecipeTable recipes={recipes}/>
  );
};
