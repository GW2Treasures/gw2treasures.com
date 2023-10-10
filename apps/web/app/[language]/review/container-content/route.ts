import { redirect } from 'next/navigation';
import { getRandomContainerContentReviewId } from './random';

export async function GET(): Promise<never> {
  const id = await getRandomContainerContentReviewId();

  if(!id) {
    redirect('/review');
  }

  redirect(`/review/container-content/${id}`);
}
