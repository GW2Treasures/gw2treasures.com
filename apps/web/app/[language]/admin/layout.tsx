import type { ReactNode } from 'react';
import { ensureUserIsAdmin } from './admin';
import { NavBar } from '@/components/Layout/NavBar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await ensureUserIsAdmin();

  return (
    <div>
      <NavBar base="/admin/" items={[
        { segment: 'users', label: 'Users', icon: 'user' },
        { segment: 'reviews', label: 'Reviews', icon: 'review-queue' },
        { segment: 'apps', label: 'Apps', icon: 'apps' },
        { segment: 'views', label: 'Page Views', icon: 'eye' },
        { segment: 'jobs', label: 'Jobs', icon: 'jobs' },
      ]}/>
      {children}
    </div>
  );
}

export const metadata = {
  title: {
    template: 'Admin: %s',
    default: ''
  }
};
