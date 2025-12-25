import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { createMetadata } from '@/lib/metadata';
import { SkeletonTable } from '@/components/Skeleton/SkeletonTable';

export default function AdminUserLoading() {
  return (
    <PageLayout>
      <Headline id="users">Users</Headline>

      <SkeletonTable columns={[
        'Username',
        'Email',
        'Roles',
        'Scopes',
        'GW2 Linked',
        'Created At',
        'Last access',
      ]}/>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Users'
});
