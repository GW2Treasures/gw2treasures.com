import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Notice } from '@/components/Notice/Notice';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';

export default async function LoginPage({ searchParams }: { searchParams: { logout?: '', error?: '' }}) {
  const user = await getUser();

  if(user) {
    redirect('/profile');
  }

  return (
    <PageLayout>
      {searchParams.error !== undefined && (
        <Notice type="warning">Unknown error</Notice>
      )}

      {searchParams.logout !== undefined && (
        <Notice>Logout successful</Notice>
      )}

      <LinkButton href="/auth/login" external>Login with gw2.me</LinkButton>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Login'
};
