import { getUrlFromParts, getUrlPartsFromRequest } from '@/lib/urlParts';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const baseDomain = process.env.GW2T_NEXT_DOMAIN!;

export function GET(request: NextRequest) {
  const language = headers().get('x-gw2t-lang');

  const documentation = getUrlFromParts({
    ...getUrlPartsFromRequest(request),
    domain: baseDomain,
    path: '/dev',
  });

  return NextResponse.json({ api: true, language, documentation });
}
