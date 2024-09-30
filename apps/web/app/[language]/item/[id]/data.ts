import type { Language } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import type { Gw2Api } from 'gw2-api-types';
import { cache } from '@/lib/cache';

export const getItem = cache((id: number, language: Language) => {
  return db.item.findUnique({
    where: { id },
    include: {
      history: {
        include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true }}},
        where: { revision: { language }},
        orderBy: { revision: { createdAt: 'desc' }}
      },
      icon: true,
      unlocksSkin: { select: { ...linkProperties, weight: true, type: true, subtype: true, unlocks: true, achievementBits: { include: { icon: true, rewardsItem: { select: linkProperties }, rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}}}}},
      unlocksMinis: { select: { ...linkPropertiesWithoutRarity, achievementBits: { include: { icon: true, rewardsItem: { select: linkProperties }, rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}}}}},
      unlocksGuildUpgrade: { select: linkPropertiesWithoutRarity },
      recipeOutput: { include: { ingredients: { include: { item: { select: linkProperties }, currency: { select: linkPropertiesWithoutRarity }, guildUpgrade: { select: linkPropertiesWithoutRarity }}}, unlockedByItems: { select: linkProperties }}},
      unlocksRecipe: { include: { ingredients: { include: { item: { select: linkProperties }, currency: { select: linkPropertiesWithoutRarity }, guildUpgrade: { select: linkPropertiesWithoutRarity }}}, unlockedByItems: { select: linkProperties }, outputItem: { select: linkProperties }}},
      achievementBits: { include: { icon: true, rewardsItem: { select: linkProperties }, rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}}},
      achievementRewards: { include: { icon: true, rewardsItem: { select: linkProperties }, rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}}},
      contains: { include: { contentItem: { select: { ...linkProperties, vendorValue: true, level: true, type: true, subtype: true }}}},
      containsCurrency: { include: { currency: { select: linkPropertiesWithoutRarity }}},
      wizardsVaultListings: { where: { removedFromApi: false }},
      mysticForgeIngredient: { include: { Recipe: { include: { itemIngredients: { include: { Item: { select: linkProperties }}}, outputItem: { select: linkProperties }}}}},
      mysticForgeRecipeOutput: { include: { itemIngredients: { include: { Item: { select: linkProperties }}}}},
      _count: {
        select: { ingredient: true, suffixIn: true, contains: true, containedIn: true, mysticForgeIngredient: true }
      }
    }
  });
}, ['item'], { revalidate: 60 });

export const getRevision = cache(async (id: number, language: Language, revisionId?: string) => {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentItem_${language}`]: { id }}});

  return {
    revision,
    data: revision ? JSON.parse(revision.data) as Gw2Api.Item : undefined,
  };
}, ['revision-item'], { revalidate: 60 });
