import { getCurrentUrl } from '@/lib/url';
import { Language } from '@gw2treasures/database';
import { NextResponse } from 'next/server';

export function GET() {
  const protocol = getCurrentUrl().protocol;

  return NextResponse.json({
    web_apps: Object.values(Language).map((language) => ({ web_app_identity: `${protocol}//${language}.${process.env.GW2T_NEXT_DOMAIN}` }))
  });
}
