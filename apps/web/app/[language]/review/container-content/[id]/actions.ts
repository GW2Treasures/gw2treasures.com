'use server';

import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { ReviewState } from '@gw2treasures/database';
import { redirect } from 'next/navigation';
import { getRandomContainerContentReviewId } from '../route';
import { AddedItem } from 'app/[language]/item/[id]/_edit-content/types';

// eslint-disable-next-line require-await
export async function approve(data: FormData) {
  const { id, user, review } = await getUserAndReview(data);
  const { removedItems, addedItems } = review.changes as unknown as { removedItems: number[], addedItems: AddedItem[] };

  if(!review.relatedItemId) {
    redirect(`/review/container-content/${id}?error`);
  }

  const containerItemId = review.relatedItemId;

  await db.$transaction([
    // remove contents
    db.content.deleteMany({ where: { containerItemId, contentItemId: { in: removedItems }}}),

    // add new contents
    db.content.createMany({
      data: addedItems.map(({ item, chance, quantity }) => ({
        containerItemId,
        contentItemId: item.id,
        chance: chance,
        quantity: quantity,
      }))
    }),

    // approve review
    db.review.update({
      where: { id },
      data: { reviewerId: user.id, reviewedAt: new Date(), state: ReviewState.Approved }
    }),
  ]);

  const nextId = await getRandomContainerContentReviewId();

  redirect(nextId ? `/review/container-content/${nextId}` : '/review');
}

export async function reject(data: FormData) {
  const { id, user, review } = await getUserAndReview(data);

  await db.review.update({
    where: { id },
    data: { reviewerId: user.id, reviewedAt: new Date(), state: ReviewState.Rejected }
  });

  const nextId = await getRandomContainerContentReviewId();

  redirect(nextId ? `/review/container-content/${nextId}` : '/review');
}

async function getUserAndReview(data: FormData) {
  const id = data.get('id')?.toString();

  if(!id) {
    redirect(`/review?error`);
  }

  const [user, review] = await Promise.all([
    getUser(),
    db.review.findUnique({ where: { id }})
  ]);

  if(!user) {
    redirect('/login');
  }

  if(!review) {
    redirect('/review/container-content');
  }

  if(review.state !== ReviewState.Open) {
    redirect(`/review/container-content/${id}?error`);
  }

  return { id, user, review };
}
