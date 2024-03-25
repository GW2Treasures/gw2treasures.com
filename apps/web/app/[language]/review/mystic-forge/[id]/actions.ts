'use server';

import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { ReviewState } from '@gw2treasures/database';
import { redirect } from 'next/navigation';
import { getRandomReviewId } from '../../random';
import { revalidateTag } from 'next/cache';
import type { FormState } from '@gw2treasures/ui/components/Form/Form';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { isNotFoundError } from 'next/dist/client/components/not-found';
import type { SubmitEditMysticForgeOrder } from 'app/[language]/item/[id]/edit-mystic-forge/action';

class ReviewError extends Error {}

export async function submit(id: string, _: FormState, formData: FormData): Promise<FormState> {
  const action = formData.get('action');

  if(typeof action !== 'string' || (action !== 'approve' && action !== 'reject')) {
    return { error: 'Invalid action.' };
  }

  try {
    if(action === 'reject') {
      await reject(id);
    } else {
      await approve(id);
    }
  } catch (e) {
    // rethrow Next.js redirect/notFound errors
    if(isRedirectError(e) || isNotFoundError(e)) {
      throw e;
    }

    if(e instanceof ReviewError) {
      return { error: e.message };
    }

    console.error(e);
  }

  return { error: 'Unknown error' };
}

export async function approve(id: string): Promise<never> {
  const { user, review } = await getUserAndReview(id);
  const { recipeId, outputItemId, outputCountMin, outputCountMax, ingredients } = review.changes as unknown as SubmitEditMysticForgeOrder;

  await db.$transaction([
    recipeId
      ? db.mysticForgeRecipe.update({
          where: { id: recipeId },
          data: {
            outputItemId, outputCountMin, outputCountMax,
            itemIngredients: {
              deleteMany: {},
              createMany: { data: ingredients }
            }
          }
        })
      : db.mysticForgeRecipe.create({
          data: {
            outputItemId, outputCountMin, outputCountMax,
            itemIngredients: { createMany: { data: ingredients }}
          }
        }),

    // approve review
    db.review.update({
      where: { id },
      data: { reviewerId: user.id, reviewedAt: new Date(), state: ReviewState.Approved }
    }),
  ]);

  revalidateTag('open-reviews');

  const nextId = await getRandomReviewId('MysticForge');

  redirect(nextId ? `/review/mystic-forge/${nextId}` : '/review');
}


export async function reject(id: string): Promise<never> {
  const { user } = await getUserAndReview(id);

  await db.review.update({
    where: { id },
    data: { reviewerId: user.id, reviewedAt: new Date(), state: ReviewState.Rejected }
  });

  revalidateTag('open-reviews');

  const nextId = await getRandomReviewId('MysticForge');
  redirect(nextId ? `/review/mystic-forge/${nextId}` : '/review');
}


async function getUserAndReview(id: string) {
  const [user, review] = await Promise.all([
    getUser(),
    db.review.findUnique({ where: { id }})
  ]);

  if(!user) {
    redirect('/login');
  }

  if(!review) {
    redirect('/review/mystic-forge');
  }

  if(review.state !== ReviewState.Open) {
    throw new ReviewError('This request has already been reviewed.');
  }

  if(review.requesterId === user.id && !user.roles.includes('Admin')) {
    throw new ReviewError('You can not review your own request.');
  }

  return { id, user, review };
}
