import { getUser } from '@/lib/getUser';
import { notFound, redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getUser();

  if(!user) {
    redirect('/login');
  }

  if(!user.roles.includes('Admin')) {
    notFound();
  }

  return <>{children}</>;
}

export const metadata = {
  title: {
    template: 'Admin: %s',
    default: ''
  }
};
