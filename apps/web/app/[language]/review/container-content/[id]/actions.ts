'use server';

import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { ReviewState } from '@gw2treasures/database';
import { redirect } from 'next/navigation';
import { getRandomReviewId } from '../../random';
import type { EditContentOrder } from 'app/[language]/item/[id]/_edit-content/types';
import { revalidateTag } from 'next/cache';

export async function approve(data: FormData) {
  const { id, user, review } = await getUserAndReview(data);
  const { removedItems, addedItems, removedCurrencies, addedCurrencies } = review.changes as unknown as EditContentOrder;

  if(!review.relatedItemId) {
    redirect(`/review/container-content/${id}?error`);
  }

  const containerItemId = review.relatedItemId;

  await db.$transaction([
    // remove item contents
    db.content.deleteMany({ where: { containerItemId, contentItemId: { in: removedItems }}}),

    // add new item contents
    db.content.createMany({
      data: addedItems.map(({ item, chance, quantity }) => ({
        containerItemId,
        contentItemId: item.id,
        chance,
        quantity,
      }))
    }),

    // remove currency contents
    db.currencyContent.deleteMany({ where: { containerItemId, currencyId: { in: removedCurrencies }}}),

    // add new item contents
    db.currencyContent.createMany({
      data: addedCurrencies.map(({ currency, min, max }) => ({
        containerItemId,
        currencyId: currency.id,
        min,
        max,
      }))
    }),

    // approve review
    db.review.update({
      where: { id },
      data: { reviewerId: user.id, reviewedAt: new Date(), state: ReviewState.Approved }
    }),
  ]);

  revalidateTag('open-reviews');

  const nextId = await getRandomReviewId('ContainerContent');

  redirect(nextId ? `/review/container-content/${nextId}` : '/review');
}


export async function reject(data: FormData) {
  const { id, user, review } = await getUserAndReview(data);

  await db.review.update({
    where: { id },
    data: { reviewerId: user.id, reviewedAt: new Date(), state: ReviewState.Rejected }
  });

  revalidateTag('open-reviews');

  const nextId = await getRandomReviewId('ContainerContent');

  redirect(nextId ? `/review/container-content/${nextId}` : '/review');
}


async function getUserAndReview(data: FormData) {
  const id = data.get('id')?.toString();

  if(!id) {
    redirect('/review');
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

  if(review.state !== ReviewState.Open || (review.requesterId === user.id && !user.roles.includes('Admin'))) {
    redirect(`/review/container-content/${id}?error`);
  }

  return { id, user, review };
}
