import { redirect } from 'next/navigation';
import { getRandomReviewId } from '../random';
import { ReviewQueue } from '@gw2treasures/database';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest): Promise<never> {
  const skip = request.nextUrl.searchParams.get('skip') || undefined;

  const id = await getRandomReviewId(ReviewQueue.ContainerContent, skip);

  if(!id) {
    redirect('/review');
  }

  redirect(`/review/container-content/${id}`);
}
