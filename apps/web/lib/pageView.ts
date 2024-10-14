import { cache } from 'react';
import { db } from './prisma';
import { headers } from 'next/headers';

export const pageView = cache(async function pageView(page: string, pageId?: number) {
  // don't log page views for bots and prefetch
  if((await headers()).get('x-gw2t-is-bot') === '1' || (await headers()).get('x-gw2t-is-prefetch') === '1' || (await headers()).get('Next-Router-Prefetch') === '1' || (await headers()).get('X-Next-Router-Prefetch') === '1') {
    return;
  }

  // get AS number (header set by cloudflare in prod)
  const asn = parseInt((await headers()).get('x-asn')!) || null;

  await db.pageView.create({ data: { page, pageId, asn }});
});
