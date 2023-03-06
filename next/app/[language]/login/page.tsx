// Import your Client Component
import LoginForm from './LoginForm';

export default function LoginPage() {
  return <LoginForm/>;
}

export function generateStaticParams() {
  return [{ language: 'de' }, { language: 'en' }, { language: 'es' }, { language: 'fr' }];
}
