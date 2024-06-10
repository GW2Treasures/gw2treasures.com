import { cache } from 'react';
import { db } from './prisma';
import { headers } from 'next/headers';

export const pageView = cache(async function pageView(page: string, pageId?: number) {
  // don't log page views for bots and prefetch
  if(headers().get('x-gw2t-is-bot') === '1' || headers().get('Next-Router-Prefetch') === '1') {
    return;
  }

  await db.pageView.create({ data: { page, pageId }});
});
