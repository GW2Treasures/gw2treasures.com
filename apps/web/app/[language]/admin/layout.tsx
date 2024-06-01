import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import type { ReactNode } from 'react';
import { ensureUserIsAdmin } from './admin';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await ensureUserIsAdmin();

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '8px 0', backgroundColor: 'var(--color-background-light)' }}>
        <LinkButton appearance="menu" href="/admin/users" icon="user">Users</LinkButton>
        <LinkButton appearance="menu" href="/admin/reviews" icon="review-queue">Reviews</LinkButton>
        <LinkButton appearance="menu" href="/admin/apps" icon="apps">Apps</LinkButton>
        <LinkButton appearance="menu" href="/admin/views" icon="eye">Page Views</LinkButton>
        <LinkButton appearance="menu" href="/admin/jobs" icon="jobs">Jobs</LinkButton>
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
