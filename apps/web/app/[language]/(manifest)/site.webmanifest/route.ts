import { getCurrentUrl } from '@/lib/url';
import { Language } from '@gw2treasures/database';
import { NextResponse } from 'next/server';

export function GET() {
  const protocol = getCurrentUrl().protocol;

  return NextResponse.json({
    id: 'gw2t',
    name: 'gw2treasures.com',
    short_name: 'gw2treasures.com',
    start_url: '/',
    icons: [{
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    }, {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    }, {
      src: '/maskable_icon_x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable'
    }, {
      src: '/maskable_icon_x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }],
    theme_color: '#b7000d',
    background_color: '#ffffff',
    display: 'standalone',
    scope_extensions: Object.values(Language).map((language) => ({ origin: `${protocol}//${language}.${process.env.GW2T_NEXT_DOMAIN}` }))
  }, {
    headers: {
      'content-type': 'application/manifest+json'
    }
  });
}
