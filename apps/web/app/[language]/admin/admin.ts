import { getUser } from '@/lib/getUser';
import { notFound } from 'next/navigation';

export async function ensureUserIsAdmin() {
  const user = await getUser();

  if(!user || !user.roles.includes('Admin')) {
    notFound();
  }
}
