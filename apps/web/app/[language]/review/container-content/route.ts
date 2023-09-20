import { redirect } from 'next/navigation';
import { getRandomContainerContentReviewId } from './random';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(): Promise<never> {
  const id = await getRandomContainerContentReviewId();

  if(!id) {
    redirect('/review');
  }

  redirect(`/review/container-content/${id}`);
}
