import type { UnwrapJsonResponse } from '../helper';
import { decode } from 'gw2e-chat-codes';
import { isTruthy } from '@gw2treasures/ui';
import { NextResponse } from 'next/server';
import { searchAchievements, searchBuilds, searchItems, searchSkills, searchSkins, splitSearchTerms } from './helper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchValue = searchParams.get('q') ?? '';

  const terms = splitSearchTerms(searchValue);
  const chatCodes = terms.map(decode).filter(isTruthy);

  const [achievements, items, skills, skins, builds] = await Promise.all([
    searchAchievements(terms),
    searchItems(terms, chatCodes),
    searchSkills(terms, chatCodes),
    searchSkins(terms, chatCodes),
    searchBuilds(terms.filter((t) => t.toString() === Number(t).toString())),
  ]);

  return NextResponse.json({ searchValue, terms, ...achievements, items, skills, skins, builds });
}

export type ApiSearchResponse = UnwrapJsonResponse<ReturnType<typeof GET>>;
