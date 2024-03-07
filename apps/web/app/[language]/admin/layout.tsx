import { getUser } from '@/lib/getUser';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { notFound, redirect } from 'next/navigation';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getUser();

  if(!user || !user.roles.includes('Admin')) {
    notFound();
  }

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '8px 16px' }}>
        <b>Admin:</b>
        <LinkButton appearance="menu" href="/admin/users">Users</LinkButton>
        <LinkButton appearance="menu" href="/admin/reviews">Reviews</LinkButton>
        <LinkButton appearance="menu" href="/admin/apps">Apps</LinkButton>
        <LinkButton appearance="menu" href="/admin/views">Page Views</LinkButton>
        <LinkButton appearance="menu" href="/admin/jobs">Jobs</LinkButton>
      </div>
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
