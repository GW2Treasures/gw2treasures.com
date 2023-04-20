// Import your Client Component
import { LinkButton } from '@/components/Form/Button';
import { PageLayout } from '@/components/Layout/PageLayout';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const user = await getUser();

  if(user) {
    redirect('/profile');
  }

  return (
    <PageLayout>
      <LinkButton href="/auth/login/discord" external>Login with Discord</LinkButton>
    </PageLayout>
  );
}

// export function generateStaticParams() {
//   return [{ language: 'de' }, { language: 'en' }, { language: 'es' }, { language: 'fr' }];
// }
