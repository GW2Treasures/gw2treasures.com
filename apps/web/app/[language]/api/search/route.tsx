import type { UnwrapJsonResponse } from '../helper';
import { NextResponse } from 'next/server';
import { searchAchievements, searchBuilds, searchCurrencies, searchItems, searchProfession, searchSkills, searchSkins, searchTraits, splitSearchTerms } from './helper';
import { decodeAllChatlinks } from '@gw2/chatlink';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchValue = searchParams.get('q') ?? '';

  const terms = splitSearchTerms(searchValue);
  const chatCodes = decodeAllChatlinks(searchValue);

  const [achievements, currencies, items, skills, traits, professions, skins, builds] = await Promise.all([
    searchAchievements(terms),
    searchCurrencies(terms),
    searchItems(terms, chatCodes),
    searchSkills(terms, chatCodes),
    searchTraits(terms, chatCodes),
    searchProfession(terms, chatCodes),
    searchSkins(terms, chatCodes),
    searchBuilds(terms.filter((t) => t.toString() === Number(t).toString())),
  ]);

  return NextResponse.json({ searchValue, terms, ...achievements, currencies, items, skills, traits, professions, skins, builds });
}

export type ApiSearchResponse = UnwrapJsonResponse<ReturnType<typeof GET>>;
