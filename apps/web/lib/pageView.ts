import { cache } from 'react';
import { db } from './prisma';
import { headers } from 'next/headers';

export const pageView = cache(async function pageView(page: string, pageId?: number) {
  // dont log page views for bots
  if(headers().get('x-gw2t-is-bot') === '1') {
    return;
  }

  await db.pageView.create({ data: { page, pageId }});
});
