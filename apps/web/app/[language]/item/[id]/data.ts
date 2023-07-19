import { remember } from '@/lib/remember';
import { Item, Language } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { Gw2Api } from 'gw2-api-types';

export const getItem = remember(60, function getItem(id: number, language: Language) {
  return db.item.findUnique({
    where: { id },
    include: {
      history: {
        include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true }}},
        where: { revision: { language }},
        orderBy: { revision: { createdAt: 'desc' }}
      },
      icon: true,
      unlocksSkin: { select: { ...linkProperties, weight: true, type: true, subtype: true, achievementBits: { select: linkPropertiesWithoutRarity }}},
      recipeOutput: { include: { currentRevision: true, itemIngredients: { include: { Item: { select: linkProperties }}}, unlockedByItems: { select: linkProperties }}},
      unlocksRecipe: { include: { currentRevision: true, itemIngredients: { include: { Item: { select: linkProperties }}}, unlockedByItems: { select: linkProperties }, outputItem: { select: linkProperties }}},
      achievementBits: { select: linkPropertiesWithoutRarity, orderBy: { id: 'asc' }},
      achievementRewards: { select: linkPropertiesWithoutRarity, orderBy: { id: 'asc' }},
      contains: { include: { contentItem: { select: { ...linkProperties, value: true, level: true, type: true, subtype: true }}}},
      containedIn: { include: { containerItem: { select: { ...linkProperties, value: true, level: true, type: true, subtype: true }}}},
      containsCurrency: { include: { currency: { select: linkPropertiesWithoutRarity }}},
      suffixIn: { include: { icon: true }},
      _count: {
        select: { ingredient: true }
      }
    }
  });
});

export const getRevision = remember(60, async function getRevision(id: number, language: Language, revisionId?: string) {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentItem_${language}`]: { id }}});

  return {
    revision,
    data: revision ? JSON.parse(revision.data) as Gw2Api.Item : undefined,
  };
});
