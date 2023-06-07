'use server';

import { getUser } from '@/lib/getUser';
import { AddedItem } from './types';
import { db } from '@/lib/prisma';
import { ReviewState } from '@gw2treasures/database';

// eslint-disable-next-line require-await
export async function submitToReview({ itemId, removedItems, addedItems }: { itemId: number, removedItems: number[], addedItems: AddedItem[] }) {
  if(removedItems.length === 0 && addedItems.length === 0) {
    console.log('No changes');
    return false;
  }

  const preConditions = await canSubmit(itemId);

  if(!preConditions.canSubmit) {
    console.log('Can not submit review', preConditions.reason);
    return false;
  }

  await db.review.create({
    data: {
      state: ReviewState.Open,
      changes: { removedItems, addedItems } as any,
      queue: 'ContainerContent',
      requesterId: preConditions.userId,
      relatedItemId: itemId,
    }
  });

  return true;
}

export async function canSubmit(itemId: number): Promise<CanSubmitResponse> {
  const user = await getUser();

  if(!user) {
    return { canSubmit: false, reason: 'LOGIN' };
  }

  const pendingReview = await db.review.findFirst({
    where: { queue: 'ContainerContent', relatedItemId: itemId, state: ReviewState.Open },
    select: { id: true, requesterId: true },
  });

  if(pendingReview !== null) {
    return { canSubmit: false, reason: 'PENDING_REVIEW', reviewId: pendingReview.id, ownReview: pendingReview.requesterId === user.id };
  }

  return { canSubmit: true, userId: user.id };
}

export type CanSubmitResponse = { canSubmit: true, userId: string } | { canSubmit: false, reason: 'LOGIN' } | { canSubmit: false, reason: 'PENDING_REVIEW', reviewId: string, ownReview: boolean };
