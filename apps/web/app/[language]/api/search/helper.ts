import { db } from '@/lib/prisma';
import type { Prisma, Rarity } from '@gw2treasures/database';
import { decode } from 'gw2e-chat-codes';
import { isDefined, isTruthy } from '@gw2treasures/helper/is';
import { cache } from '@/lib/cache';

type ChatCode = Exclude<ReturnType<typeof decode>, false>;
type ChatCodeOfType<Type> = Type extends Exclude<ChatCode['type'], 'item' | 'objective' | 'build'> ? { type: Type, id: number } : Extract<ChatCode, { type: Type }>

function isChatCodeWithType<T extends ChatCode['type']>(expectedType: T): (chatCode: ChatCode) => chatCode is ChatCodeOfType<T> {
  // @ts-ignore
  return (chatCode) => chatCode.type === expectedType;
}

export function splitSearchTerms(query: string): string[] {
  const terms = Array.from(query.matchAll(/"(?:\\\\.|[^\\\\"])+"|\S+/g)).map((term) => {
    return unpackQuotes(term[0])
      .replaceAll('\\\\', '\\')
      .replaceAll('\\"', '"')
      .replaceAll('%', '\\%');
  });

  return terms;
}

function unpackQuotes(value: string): string {
  if(value.at(0) === '"' && value.at(-1) === '"') {
    return value.substring(1, value.length - 1);
  }

  return value;
}

function toNumber(value: string): number | undefined {
  const number = Number(value);

  if(number.toFixed() === value && number > 0) {
    return number;
  }

  return undefined;
}

type LocalizedNameInput = {
  AND?: LocalizedNameInput[];
  OR?: LocalizedNameInput[];
  name_de?: Prisma.StringFilter | string;
  name_en?: Prisma.StringFilter | string;
  name_es?: Prisma.StringFilter | string;
  name_fr?: Prisma.StringFilter | string;
}

function nameQuery(terms: string[]): LocalizedNameInput[] {
  if(terms.length === 0) {
    return [];
  }

  const nameQueries: LocalizedNameInput[] = ['de', 'en', 'es', 'fr'].map((lang) => ({
    AND: terms.map((term) => ({ [`name_${lang}`]: { contains: term, mode: 'insensitive' }}))
  }));

  return nameQueries;
}

export const searchAchievements = cache(async (terms: string[]) => {
  const nameQueries = nameQuery(terms);

  const [achievements, achievementCategories, achievementGroups] = await Promise.all([
    db.achievement.findMany({
      where: terms.length > 0 ? { OR: [...nameQueries, { rewardsTitle: { some: { OR: nameQueries }}}] } : undefined,
      take: 5,
      include: { icon: true, achievementCategory: true, rewardsTitle: true },
      orderBy: { views: 'desc' }
    }),
    db.achievementCategory.findMany({
      where: terms.length > 0 ? { OR: nameQueries } : undefined,
      take: 5,
      include: { icon: true, achievementGroup: true }
    }),
    db.achievementGroup.findMany({
      where: terms.length > 0 ? { OR: nameQueries } : undefined,
      take: 5,
    }),
  ]);

  return { achievements, achievementCategories, achievementGroups };
}, ['search', 'search-achievements'], { revalidate: 60 });

export type ItemFilters = {
  iconId?: number | null,
  rarity?: Rarity,
  type?: string,
  subtype?: string | null,
  weight?: string | null,
  vendorValue?: number | null,
  level?: number,
}

export const searchItems = cache(async (terms: string[], chatCodes: ChatCode[], filter?: ItemFilters) => {
  const nameQueries = nameQuery(terms);

  const itemChatCodes = chatCodes.filter(isChatCodeWithType('item'));
  const itemIdsInChatCodes = itemChatCodes.flatMap((chatCode) => [chatCode.id, ...(chatCode.upgrades || [])]);

  const recipeChatCodes = chatCodes.filter(isChatCodeWithType('recipe'));
  const recipeIdsInChatCodes = recipeChatCodes.map((chatCode) => chatCode.id);

  const numberTerms = terms.map(toNumber).filter(isTruthy);

  const chatCodeWhere = [
    { id: { in: itemIdsInChatCodes }},
    { recipeOutput: { some: { id: { in: recipeIdsInChatCodes }}}},
    { unlocksRecipeIds: { hasSome: recipeIdsInChatCodes }},
  ];

  const joinedTerms = terms.join(' ');
  const exactWhere = [
    filter,
    {
      OR: [
        { name_de: { equals: joinedTerms, mode: 'insensitive' as const }},
        { name_en: { equals: joinedTerms, mode: 'insensitive' as const }},
        { name_es: { equals: joinedTerms, mode: 'insensitive' as const }},
        { name_fr: { equals: joinedTerms, mode: 'insensitive' as const }},
        { id: { in: numberTerms }},
        ...chatCodeWhere,
      ]
    }
  ].filter(isDefined);

  const containsTermsWhere = [
    filter,
    terms.length > 0 ? { OR: nameQueries } : undefined
  ].filter(isDefined);

  // get exact name matches first (only search if we are actually filtering for something)
  const exactNameMatches = terms.length + chatCodes.length > 0 ? await db.item.findMany({
    where: { AND: exactWhere },
    take: 50,
    include: { icon: true },
    orderBy: { views: 'desc' }
  }) : [];

  // if we have less then 5 exact matches, we fill the remainder with items that just contain the search terms
  const termMatches = exactNameMatches.length < 5 ? await db.item.findMany({
    where: { AND: [...containsTermsWhere, { id: { notIn: exactNameMatches.map(({ id }) => id) }}] },
    take: 5 - exactNameMatches.length,
    include: { icon: true },
    orderBy: { views: 'desc' }
  }) : [];

  return [...exactNameMatches, ...termMatches];
}, ['search', 'search-items'], { revalidate: 60 });

export const searchSkills = cache((terms: string[], chatCodes: ChatCode[]) => {
  const nameQueries = nameQuery(terms);
  const skillChatCodes = chatCodes.filter(isChatCodeWithType('skill'));
  const skillIdsInChatCodes = skillChatCodes.map(({ id }) => id);

  return db.skill.findMany({
    where: terms.length + chatCodes.length > 0 ? { OR: [...nameQueries, { id: { in: skillIdsInChatCodes }}] } : undefined,
    take: 5,
    include: { icon: true }
  });
}, ['search', 'search-skills'], { revalidate: 60 });

export const searchSkins = cache((terms: string[], chatCodes: ChatCode[]) => {
  const nameQueries = nameQuery(terms);
  const itemChatCodes = chatCodes.filter(isChatCodeWithType('item'));
  const skinChatCodes = chatCodes.filter(isChatCodeWithType('skin'));
  const skinIdsInChatcodes = [
    ...itemChatCodes.map(({ skin }) => skin).filter(isTruthy),
    ...skinChatCodes.map(({ id }) => id)
  ];

  return db.skin.findMany({
    where: terms.length + chatCodes.length > 0 ? { OR: [...nameQueries, { id: { in: skinIdsInChatcodes }}] } : undefined,
    take: 5,
    include: { icon: true }
  });
}, ['search', 'search-skins'], { revalidate: 60 });

export const searchBuilds = cache((terms: string[]) => {
  return db.build.findMany({
    where: { OR: terms.map((term) => ({ id: Number(term) })) },
    take: 5,
  });
}, ['search', 'search-builds'], { revalidate: 60 });
