import { redirect } from 'next/navigation';
import { db } from '@/lib/prisma';
import { Prisma } from '@gw2treasures/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const id = await getRandomContainerContentReviewId();

  if(!id) {
    redirect('/review');
  }

  redirect(`/review/container-content/${id}`);
}

export async function getRandomContainerContentReviewId(): Promise<string | undefined> {
  const where: Prisma.ReviewWhereInput = { queue: 'ContainerContent', state: 'Open' };
  const count = await db.review.count({ where });

  if(count === 0) {
    return undefined;
  }

  const review = await db.review.findFirst({
    where,
    take: 1,
    skip: Math.floor(Math.random() * count),
    select: { id: true }
  });

  if(!review) {
    return undefined;
  }

  return review.id;
}
