import { getBaseUrl } from '@/lib/url';
import { Language } from '@gw2treasures/database';
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(Object.fromEntries(
    Object.values(Language).map((language) => [
      getBaseUrl(language).origin,
      { scope: '/' }
    ])
  ));
}
