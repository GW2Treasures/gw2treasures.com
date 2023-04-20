// Import your Client Component
import { LinkButton } from '@/components/Form/Button';
import { PageLayout } from '@/components/Layout/PageLayout';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <PageLayout>
      <LinkButton href="/auth/login/discord" external>Login with Discord</LinkButton>
    </PageLayout>
  );
}

// export function generateStaticParams() {
//   return [{ language: 'de' }, { language: 'en' }, { language: 'es' }, { language: 'fr' }];
// }
