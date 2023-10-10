import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/prisma';

export async function GET(): Promise<never> {
  const count = await db.achievement.count();

  const achievement = await db.achievement.findFirst({ take: 1, skip: Math.floor(Math.random() * count), select: { id: true }});

  if(!achievement) {
    notFound();
  }

  redirect(`/achievement/${achievement.id}`);
}
