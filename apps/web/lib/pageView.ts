import { cache } from 'react';
import { db } from './prisma';
import { headers } from 'next/headers';
import { after } from 'next/server';

export const pageView = cache(async function pageView(page: string, pageId?: number) {
  const header = await headers();

  // don't log page views for bots and prefetch
  if(header.get('x-gw2t-is-bot') === '1' || header.get('x-gw2t-is-prefetch') === '1' || header.get('Next-Router-Prefetch') === '1' || header.get('X-Next-Router-Prefetch') === '1') {
    return;
  }

  // get AS number (header set by cloudflare in prod)
  const asn = parseInt(header.get('x-asn')!) || null;

  try {
    after(() => db.pageView.create({ data: { page, pageId, asn }}));
  } catch(e) {
    // we can ignore this error, page views are not critical
    console.log(e);
  }
});
