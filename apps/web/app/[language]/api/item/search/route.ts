import type { UnwrapJsonResponse } from '../../helper';
import { NextResponse } from 'next/server';
import { searchItems, splitSearchTerms, type ItemFilters } from '../../search/helper';
import { decode } from 'gw2e-chat-codes';
import { isTruthy } from '@gw2treasures/helper/is';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchValue = searchParams.get('q') ?? '';

  const terms = splitSearchTerms(searchValue);
  const chatCodes = terms.map(decode).filter(isTruthy);

  const filter = {
    iconId: searchParams.has('iconId') ? JSON.parse(searchParams.get('iconId')!) : undefined,
    rarity: searchParams.has('rarity') ? searchParams.get('rarity') : undefined,
    type: searchParams.has('type') ? searchParams.get('type') : undefined,
    subtype: searchParams.has('subtype') ? JSON.parse(searchParams.get('subtype')!) : undefined,
    weight: searchParams.has('weight') ? JSON.parse(searchParams.get('weight')!) : undefined,
    vendorValue: searchParams.has('vendorValue') ? JSON.parse(searchParams.get('vendorValue')!) : undefined,
    level: searchParams.has('level') ? JSON.parse(searchParams.get('level')!) : undefined,
  } as ItemFilters;

  const items = await searchItems(terms, chatCodes, filter);

  return NextResponse.json({ items });
}

export type ApiItemSearchResponse = UnwrapJsonResponse<ReturnType<typeof GET>>;
