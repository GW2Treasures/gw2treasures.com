'use server';

import { db } from '@/lib/prisma';

export async function getCurrencies() {
  const currencies = await db.currency.findMany({
    include: { icon: true },
    orderBy: { order: 'asc' },
  });

  return currencies;
}
