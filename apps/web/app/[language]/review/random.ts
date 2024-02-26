import { db } from '@/lib/prisma';
import { Prisma, ReviewQueue } from '@gw2treasures/database';

export async function getRandomReviewId(queue: ReviewQueue): Promise<string | undefined> {
  const where: Prisma.ReviewWhereInput = { queue, state: 'Open' };
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
