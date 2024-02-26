import { redirect } from 'next/navigation';
import { getRandomReviewId } from '../random';
import { ReviewQueue } from '@gw2treasures/database';

export async function GET(): Promise<never> {
  const id = await getRandomReviewId(ReviewQueue.ContainerContent);

  if(!id) {
    redirect('/review');
  }

  redirect(`/review/container-content/${id}`);
}
