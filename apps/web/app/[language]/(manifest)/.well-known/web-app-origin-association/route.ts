import { getCurrentUrl } from '@/lib/url';
import { Language } from '@gw2treasures/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const currentUrl = await getCurrentUrl();
  const protocol = currentUrl.protocol;

  return NextResponse.json(Object.fromEntries(
    Object.values(Language).map((language) => [
      `${protocol}//${language}.${process.env.GW2T_NEXT_DOMAIN}`,
      { scope: '/' }
    ])
  ));
}
