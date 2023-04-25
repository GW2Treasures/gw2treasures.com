import { remember } from '@/lib/remember';
import { Item, Language } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';

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
      suffixIn: { include: { icon: true }},
      _count: {
        select: { ingredient: true }
      }
    }
  });
});

export const getRevision = remember(60, function getRevision(id: number, language: Language, revisionId?: string) {
  return revisionId
    ? db.revision.findUnique({ where: { id: revisionId }})
    : db.revision.findFirst({ where: { [`currentItem_${language}`]: { id }}});
});

export const getSimilarItems = remember(60, async function getSimilarItems(item: Item) {
  const similarItems = await db.item.findMany({
    where: {
      id: { not: item.id },
      OR: [
        { name_de: item.name_de },
        { name_en: item.name_en },
        { name_es: item.name_es },
        { name_fr: item.name_fr },
        { iconId: item.iconId },
        { unlocksSkinIds: { hasSome: item.unlocksSkinIds }},
        {
          type: item.type,
          subtype: item.subtype,
          rarity: item.rarity,
          weight: item.weight,
          value: item.value,
          level: item.level,
        }
      ]
    },
    include: { icon: true },
    take: 32,
  });

  return similarItems;
});
