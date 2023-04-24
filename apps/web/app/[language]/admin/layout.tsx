import { getUser } from '@/lib/getUser';
import { notFound, redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getUser();

  if(!user) {
    redirect('/login');
  }

  if(!user.roles.includes('Admin')) {
    notFound();
  }

  return children;
}
