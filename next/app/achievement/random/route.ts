import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  // force dynamic rendering, because the db is not availabe at build time
  cookies();

  const count = await db.achievement.count();

  const achievement = await db.achievement.findFirst({ take: 1, skip: Math.floor(Math.random() * count), select: { id: true }});

  if(!achievement) {
    notFound();
  }

  redirect(`/achievement/${achievement.id}`);
}
