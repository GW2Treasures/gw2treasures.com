import { cache } from 'react';
import { db } from './prisma';

export const pageView = cache(async function pageView(page: string, pageId?: number) {
  await db.pageView.create({ data: { page, pageId }});
});
