import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';

export const loadItem = cache(async (itemId: number) => {
  return await db.item.findUnique(({
    where: { id: itemId },
    select: linkProperties
   }));
}, ['data/items/load-item'], { revalidate: 60, tags: ['items'] });
