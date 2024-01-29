import { RecipeTable } from '../Recipe/RecipeTable';
import { db } from '@/lib/prisma';
import type { AsyncComponent } from '@/lib/asyncComponent';
import 'server-only';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { cache } from '@/lib/cache';

const getIngredientForGuildUpgrade = cache(async (guildUpgradeId: number) => {
  const recipes = await db.recipe.findMany({
    where: { guildUpgradeIngredients: { some: { guildUpgradeId }}},
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
    }
  });

  return recipes;
}, ['ingredient-for-guild-upgrade'], { revalidate: 60 });

interface GuildUpgradeIngredientForProps {
  guildUpgradeId: number;
};

export const GuildUpgradeIngredientFor: AsyncComponent<GuildUpgradeIngredientForProps> = async ({ guildUpgradeId }) => {
  const recipes = await getIngredientForGuildUpgrade(guildUpgradeId);

  return (
    <RecipeTable recipes={recipes}/>
  );
};
