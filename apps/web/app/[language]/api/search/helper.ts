import { db } from '@/lib/prisma';
import type { Prisma, Rarity } from '@gw2treasures/database';
import { isDefined, isTruthy } from '@gw2treasures/helper/is';
import { cache } from '@/lib/cache';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { ChatlinkType, type DecodedChatlink } from '@gw2/chatlink';

const isChatlinkWithType = <T extends ChatlinkType>(expectedType: T) =>
  (chatlink: DecodedChatlink): chatlink is DecodedChatlink<Extract<DecodedChatlink, { type: T }>['type']> =>
    chatlink.type === expectedType;


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
  AND?: LocalizedNameInput[],
  OR?: LocalizedNameInput[],
  name_de?: Prisma.StringFilter | string,
  name_en?: Prisma.StringFilter | string,
  name_es?: Prisma.StringFilter | string,
  name_fr?: Prisma.StringFilter | string,
};

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

export const searchCurrencies = cache(async (terms: string[]) => {
  // don't show anything for empty search
  if(terms.length === 0) {
    return [];
  }

  const nameQueries = nameQuery(terms);

  const currencies = await db.currency.findMany({
    where: terms.length > 0 ? { OR: nameQueries } : undefined,
    take: 5,
    include: { icon: true },
    orderBy: { order: 'asc' }
  });

  return currencies;
}, ['search', 'search-currencies'], { revalidate: 60 });

export type ItemFilters = {
  iconId?: number | null,
  rarity?: Rarity,
  type?: string,
  subtype?: string | null,
  weight?: string | null,
  vendorValue?: number | null,
  level?: number,
};

export const searchItems = cache(async (terms: string[], chatCodes: DecodedChatlink[], filter?: ItemFilters) => {
  const nameQueries = nameQuery(terms);

  const itemChatlinks = chatCodes.filter(isChatlinkWithType(ChatlinkType.Item));
  const itemIdsInChatlinks = itemChatlinks.flatMap((chatCode) => [chatCode.data.itemId, chatCode.data.upgrade1, chatCode.data.upgrade2].filter(isTruthy));

  const recipeChatlinks = chatCodes.filter(isChatlinkWithType(ChatlinkType.Recipe));
  const recipeIdsInChatlinks = recipeChatlinks.map((chatCode) => chatCode.data);

  const fashionChatlinks = chatCodes.filter(isChatlinkWithType(ChatlinkType.FashionTemplate));
  const outfitIdsInFashionChatlinks = fashionChatlinks.map(({ data: template }) => template.outfit).filter(isTruthy);

  const numberTerms = terms.map(toNumber).filter(isTruthy);

  const chatCodeWhere: Prisma.ItemWhereInput[] = [
    { id: { in: itemIdsInChatlinks }},
    { recipeOutput: { some: { id: { in: recipeIdsInChatlinks }}}},
    { unlocksRecipeIds: { hasSome: recipeIdsInChatlinks }},
    { unlocksOutfits: { some: { id: { in: outfitIdsInFashionChatlinks }}}},
  ];

  const joinedTerms = terms.join(' ');
  const exactWhere: Prisma.ItemWhereInput[] = [
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
    orderBy: { relevancy: 'desc' }
  }) : [];

  // if we have less then 5 exact matches, we fill the remainder with items that just contain the search terms
  const termMatches = exactNameMatches.length < 5 ? await db.item.findMany({
    where: { AND: [...containsTermsWhere, { id: { notIn: exactNameMatches.map(({ id }) => id) }}] },
    take: 5 - exactNameMatches.length,
    include: { icon: true },
    orderBy: { relevancy: 'desc' }
  }) : [];

  return [...exactNameMatches, ...termMatches];
}, ['search', 'search-items'], { revalidate: 60 });

export const searchSkills = cache((terms: string[], chatCodes: DecodedChatlink[]) => {
  const nameQueries = nameQuery(terms);
  const skillChatlinks = chatCodes.filter(isChatlinkWithType(ChatlinkType.Skill));
  const skillIdsInChatlinks = skillChatlinks.map(({ data: id }) => id);

  return db.skill.findMany({
    where: terms.length + chatCodes.length > 0 ? { OR: [...nameQueries, { id: { in: skillIdsInChatlinks }}] } : undefined,
    take: 5,
    include: { icon: true },
    orderBy: { views: 'desc' },
  });
}, ['search', 'search-skills'], { revalidate: 60 });

export const searchTraits = cache(async (terms: string[], chatCodes: DecodedChatlink[]) => {
  // don't show anything for empty search
  if(terms.length === 0) {
    return [];
  }

  const nameQueries = nameQuery(terms);
  const traitChatlinks = chatCodes.filter(isChatlinkWithType(ChatlinkType.Trait));
  const traitIdsInChatlinks = traitChatlinks.map(({ data: id }) => id);

  return await db.trait.findMany({
    where: terms.length + chatCodes.length > 0 ? { OR: [...nameQueries, { id: { in: traitIdsInChatlinks }}] } : undefined,
    take: 5,
    include: { icon: true, specialization: { select: { ...linkPropertiesWithoutRarity, profession: { select: linkPropertiesWithoutRarity }}}},
  });
}, ['search', 'search-traits'], { revalidate: 60 });

export const searchProfession = cache(async (terms: string[], chatCodes: DecodedChatlink[]) => {
  // don't show anything for empty search
  if(terms.length === 0) {
    return [];
  }

  const nameQueries = nameQuery(terms);

  // const buildChatlinks = chatCodes.filter(isChatCodeWithType('build'));
  // const professionCodesInChatlinks = buildChatlinks.map(({ profession }) => profession);

  return await db.profession.findMany({
    where: terms.length + chatCodes.length > 0 ? { OR: [...nameQueries/*, { code: { in: professionCodesInChatlinks }}*/] } : undefined,
    take: 5,
    include: { icon: true },
  });
}, ['search', 'search-professions'], { revalidate: 60 });

export const searchSkins = cache(async (terms: string[], chatCodes: DecodedChatlink[]) => {
  const nameQueries = nameQuery(terms);
  const itemChatlinks = chatCodes.filter(isChatlinkWithType(ChatlinkType.Item));
  const skinChatlinks = chatCodes.filter(isChatlinkWithType(ChatlinkType.Wardrobe));
  const skinIdsInChatlinks = [
    ...itemChatlinks.map(({ data: { skin }}) => skin).filter(isTruthy),
    ...skinChatlinks.map(({ data: id }) => id)
  ];

  const fashionChatlinks = chatCodes.filter(isChatlinkWithType(ChatlinkType.FashionTemplate));
  const skinIdsInFashionChatlinks = fashionChatlinks.flatMap(({ data: template }) => [
    template.aquabreather, template.backpack, template.boots, template.gloves, template.helm, template.leggings, template.shoulders,
    template.weaponA1, template.weaponA2, template.weaponB1, template.weaponB2, template.weaponAquaticA, template.weaponAquaticB
  ]).filter(isTruthy);

  const numberTerms = terms.map(toNumber).filter(isTruthy);
  const joinedTerms = terms.join(' ');

  const chatCodeWhere: Prisma.SkinWhereInput = { id: { in: [...skinIdsInChatlinks, ...skinIdsInFashionChatlinks] }};

  const exactWhere: Prisma.SkinWhereInput = {
    OR: [
      { name_de: { equals: joinedTerms, mode: 'insensitive' as const }},
      { name_en: { equals: joinedTerms, mode: 'insensitive' as const }},
      { name_es: { equals: joinedTerms, mode: 'insensitive' as const }},
      { name_fr: { equals: joinedTerms, mode: 'insensitive' as const }},
      { id: { in: numberTerms }},
      chatCodeWhere,
    ]
  };

  // get exact name matches first (only search if we are actually filtering for something)
  const exactNameMatches = terms.length + chatCodes.length > 0 ? await db.skin.findMany({
    where: exactWhere,
    take: 50,
    include: { icon: true },
    orderBy: { views: 'desc' },
  }) : [];

  // if we have less then 5 exact matches, we fill the remainder with items that just contain the search terms
  const termMatches = exactNameMatches.length < 5 ? await db.skin.findMany({
    where: { AND: [{ OR: nameQueries }, { id: { notIn: exactNameMatches.map(({ id }) => id) }}] },
    take: 5 - exactNameMatches.length,
    include: { icon: true },
    orderBy: { views: 'desc' },
  }) : [];

  return [...exactNameMatches, ...termMatches];
}, ['search', 'search-skins'], { revalidate: 60 });

export const searchBuilds = cache((terms: string[]) => {
  return db.build.findMany({
    where: { OR: terms.map((term) => ({ id: Number(term) })) },
    take: 5,
  });
}, ['search', 'search-builds'], { revalidate: 60 });
