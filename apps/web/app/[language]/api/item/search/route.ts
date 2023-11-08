import type { UnwrapJsonResponse } from '../../helper';
import { NextResponse } from 'next/server';
import { searchItems, splitSearchTerms } from '../../search/route';
import { decode } from 'gw2e-chat-codes';
import { isTruthy } from '@gw2treasures/ui';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchValue = searchParams.get('q') ?? '';

  const terms = splitSearchTerms(searchValue);
  const chatCodes = terms.map(decode).filter(isTruthy);

  const items = await searchItems(terms, chatCodes);

  return NextResponse.json({ items });
}

export type ApiItemSearchResponse = UnwrapJsonResponse<ReturnType<typeof GET>>;
