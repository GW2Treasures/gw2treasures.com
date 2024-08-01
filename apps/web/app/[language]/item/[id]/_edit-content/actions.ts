'use server';

import { getUser } from '@/lib/getUser';
import { type CanSubmitResponse, type EditContentOrder, EditContentSubmitError } from './types';
import { db } from '@/lib/prisma';
import { ContentChance, Prisma, ReviewState } from '@gw2treasures/database';
import { revalidateTag } from 'next/cache';

// eslint-disable-next-line require-await
export async function submitToReview({ itemId, removedItems, addedItems, removedCurrencies, addedCurrencies }: { itemId: number } & EditContentOrder): Promise<EditContentSubmitError | true> {
  if(removedItems.length === 0 && addedItems.length === 0 && removedCurrencies.length === 0 && addedCurrencies.length === 0) {
    console.log('No changes');
    return EditContentSubmitError.NO_CHANGES;
  }

  const preConditions = await canSubmit(itemId);

  if(!preConditions.canSubmit) {
    console.log('Can not submit review', preConditions.reason);
    return preConditions.reason;
  }

  const item = await db.item.findUnique({
    where: { id: itemId },
    include: {
      contains: true,
      containsCurrency: true,
    }
  });

  if(!item) {
    return EditContentSubmitError.ITEM_NOT_FOUND;
  }

  const invalidRemovedItems = removedItems.some((removedId) => !item.contains.some(({ contentItemId }) => contentItemId === removedId));
  const invalidAddedItems = !addedItems.every((added) => {
    return (
      // valid chance
      added.chance in ContentChance &&
      // valid quantity
      Number.isInteger(added.quantity) && added.quantity > 0 &&
      // no item added twice
      !addedItems.some(({ _id, item: { id }}) => _id !== added._id && id === added.item.id) &&
      // no item added which is already in contents and not removed
      !item.contains.some(({ contentItemId }) => contentItemId === added.item.id && !removedItems.includes(contentItemId))
    );
  });

  const invalidRemovedCurrencies = removedCurrencies.some((removedId) => !item.containsCurrency.some(({ currencyId }) => currencyId === removedId));
  const invalidAddedCurrencies = !addedCurrencies.every((added) => {
    return (
      // valid quantity
      Number.isInteger(added.min) && Number.isInteger(added.max) && added.min > 0 && added.max > 0 && added.max >= added.min &&
      // no currency added twice
      !addedCurrencies.some(({ _id, currency: { id }}) => _id !== added._id && id === added.currency.id) &&
      // no currency added which is already in contents and not removed
      !item.containsCurrency.some(({ currencyId }) => currencyId === added.currency.id && !removedItems.includes(currencyId))
    );
  });

  if(invalidRemovedItems || invalidAddedItems || invalidRemovedCurrencies || invalidAddedCurrencies) {
    return EditContentSubmitError.VALIDATION_FAILED;
  }

  await db.review.create({
    data: {
      state: ReviewState.Open,
      changes: { removedItems, addedItems, removedCurrencies, addedCurrencies } as unknown as Prisma.InputJsonValue,
      queue: 'ContainerContent',
      requesterId: preConditions.userId,
      relatedItemId: itemId,
    }
  });

  revalidateTag('open-reviews');

  return true;
}

export async function canSubmit(itemId: number): Promise<CanSubmitResponse> {
  const user = await getUser();

  if(!user) {
    return { canSubmit: false, reason: EditContentSubmitError.LOGIN };
  }

  const pendingReview = await db.review.findFirst({
    where: { queue: 'ContainerContent', relatedItemId: itemId, state: ReviewState.Open },
    select: { id: true, requesterId: true },
  });

  if(pendingReview !== null) {
    return { canSubmit: false, reason: EditContentSubmitError.PENDING_REVIEW, reviewId: pendingReview.id, ownReview: pendingReview.requesterId === user.id };
  }

  return { canSubmit: true, userId: user.id };
}
