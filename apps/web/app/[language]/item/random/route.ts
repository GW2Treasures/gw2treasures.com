import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/prisma';

export async function GET(): Promise<never> {
  const count = await db.item.count();

  const item = await db.item.findFirst({ take: 1, skip: Math.floor(Math.random() * count), select: { id: true }});

  if(!item) {
    notFound();
  }

  redirect(`/item/${item.id}`);
}
