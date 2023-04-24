// Import your Client Component
import { LinkButton } from '@/components/Form/Button';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Notice } from '@/components/Notice/Notice';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';
import { DevLogin } from './dev-login';

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

      <LinkButton href="/auth/login/discord" external>Login with Discord</LinkButton>
      {process.env.NODE_ENV && (<DevLogin/>)}
    </PageLayout>
  );
}

// export function generateStaticParams() {
//   return [{ language: 'de' }, { language: 'en' }, { language: 'es' }, { language: 'fr' }];
// }
