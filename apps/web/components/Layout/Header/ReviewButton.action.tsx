'use server';

import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';

const getOpenReviewsFromDb = remember(60, function getOpenReviewsFromDb() {
  return db.review.count({ where: { state: 'Open' }});
});

export async function getOpenReviews() {
  return await getOpenReviewsFromDb();
}
