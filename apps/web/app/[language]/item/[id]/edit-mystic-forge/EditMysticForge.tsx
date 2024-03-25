import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { EditMysticForgeClient } from './EditMysticForge.client';
import { getUser } from '@/lib/getUser';
import Link from 'next/link';
import { ReviewState } from '@gw2treasures/database';

export interface EditMysticForgeProps {
  outputItemId: number;
  recipeId?: string;
}

export const EditMysticForge: FC<EditMysticForgeProps> = async ({ outputItemId, recipeId }) => {
  const user = await getUser();

  if(!user) {
    return (<p>You need to <Link href="/login">Login</Link> to submit changes.</p>);
  }

  const pendingReview = await db.review.findFirst({
    where: {
      queue: 'MysticForge',
      state: ReviewState.Open,
      relatedItemId: outputItemId,
      changes: recipeId ? { path: ['recipeId'], equals: recipeId } : undefined
    }
  });

  if(pendingReview) {
    return (<p>There is already a suggested change for this item. You can <Link href={`/review/mystic-forge/${pendingReview.id}`}>review the change now</Link>.</p>);
  }

  const outputItem = await db.item.findUnique({
    where: { id: outputItemId },
    select: linkProperties
  });

  const recipe = recipeId ? await db.mysticForgeRecipe.findUnique({
    where: { id: recipeId },
    select: {
      id: true,
      outputCountMin: true,
      outputCountMax: true,
      itemIngredients: {
        select: {
          count: true,
          itemId: true,
          Item: { select: linkProperties }
        }
      }
    }
  }) : undefined;

  if(!outputItem || (recipeId && !recipe)) {
    notFound();
  }

  return (
    <EditMysticForgeClient outputItem={outputItem} recipe={recipe ?? undefined}/>
  );
};
