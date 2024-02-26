'use server';

import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { ReviewQueue, ReviewState } from '@gw2treasures/database';
import { isUndefined } from '@gw2treasures/helper/is';
import { revalidateTag } from 'next/cache';

export interface SubmitEditMysticForgeRequest {
  recipeId?: string,
  outputItemId: number,
  outputCountMin: number | undefined,
  outputCountMax: number | undefined,
  ingredients: ({
    itemId: number | undefined,
    count: number | undefined,
  } | undefined)[]
}

export async function submitEditMysticForge(_: unknown, data: SubmitEditMysticForgeRequest): Promise<{ error: string, success?: never } | { error?: never, success: true }> {
  const user = await getUser();

  if(!user) {
    return { error: 'You need to log in to submit changes.' };
  }

  if(data.outputCountMin === undefined || isNaN(data.outputCountMin) || data.outputCountMin < 0 || data.outputCountMin > 250 || !Number.isInteger(data.outputCountMin)) {
    return { error: 'Invalid minimum output quantity.' };
  }

  if(data.outputCountMax === undefined || isNaN(data.outputCountMax) || data.outputCountMax < data.outputCountMin || data.outputCountMax > 250 || !Number.isInteger(data.outputCountMax)) {
    return { error: 'Invalid maximum output quantity' };
  }

  if(data.ingredients.some(isUndefined)) {
    return { error: 'Ingredients missing.' };
  }

  if(data.ingredients.some((ingredient) => ingredient!.itemId === undefined || isNaN(ingredient!.itemId) || ingredient!.itemId <= 0)) {
    return { error: 'Invalid ingredient.' };
  }

  if(data.ingredients.some((ingredient) => ingredient!.count === undefined || isNaN(ingredient!.count) || ingredient!.count <= 0 || ingredient!.count > 250 || !Number.isInteger(ingredient!.count))) {
    return { error: 'Invalid ingredient count.' };
  }

  // check that all items exist
  const itemIds = new Set([data.outputItemId, ...data.ingredients.map((ingredient) => ingredient!.itemId!)]);
  const itemIdCount = await db.item.count({ where: { id: { in: Array.from(itemIds) }}});

  if(itemIds.size !== itemIdCount) {
    return { error: 'Item not found' };
  }

  // check that this recipe does not exist yet
  const recipes = await db.mysticForgeRecipe.findMany({
    where: { outputItemId: data.outputItemId },
    include: { itemIngredients: true }
  });

  const identicalRecipe = recipes.find(({ outputCountMin, outputCountMax, itemIngredients }) =>
    outputCountMin === data.outputCountMin &&
    outputCountMax === data.outputCountMax &&
    itemIngredients.every(({ itemId, count }) =>
      data.ingredients.some((ingredient) => ingredient!.itemId === itemId && ingredient!.count === count))
  );

  if(identicalRecipe) {
    if(data.recipeId === identicalRecipe.id) {
      return { error: 'No changes' };
    }

    return { error: 'A mystic forge recipe with these ingredients already exists.' };
  }

  await db.review.create({
    data: {
      state: ReviewState.Open,
      changes: data as object,
      queue: ReviewQueue.MysticForge,
      relatedItemId: data.outputItemId,
      requesterId: user.id,
    }
  });

  revalidateTag('open-reviews');

  return { success: true };
}
