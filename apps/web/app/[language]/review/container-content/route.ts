import { redirect } from 'next/navigation';
import { db } from '@/lib/prisma';
import { Prisma } from '@gw2treasures/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const where: Prisma.ReviewWhereInput = { queue: 'ContainerContent', state: 'Open' };
  const count = await db.review.count({ where });

  const review = await db.review.findFirst({
    where,
    take: 1,
    skip: Math.floor(Math.random() * count),
    select: { id: true }
  });

  if(!review) {
    redirect('/review');
  }

  redirect(`/review/container-content/${review.id}`);
}
