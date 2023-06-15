import { getCurrentUrl } from '@/lib/url';
import { getUrlFromParts, getUrlPartsFromRequest } from '@/lib/urlParts';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const baseDomain = process.env.GW2T_NEXT_DOMAIN!;

export function GET() {
  const language = headers().get('x-gw2t-lang');

  const documentation = getCurrentUrl();
  documentation.hostname = baseDomain;
  documentation.pathname = '/dev/api';

  return NextResponse.json({ api: true, language, documentation });
}
