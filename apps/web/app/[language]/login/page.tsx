import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';
import { Icon } from '@gw2treasures/ui';
import { Scope } from '@gw2me/client';
import { getAlternateUrls } from '@/lib/url';
import { getReturnToUrl } from '@/lib/login-url';
import type { Metadata } from 'next';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { PageProps } from '@/lib/next';
import { cookies } from 'next/headers';
import { LoginButton } from './login.client';
import styles from './page.module.css';

export default async function LoginPage({ searchParams }: PageProps) {
  const { returnTo: returnToParam, scopes: scopesParam, error } = await searchParams;
  const returnTo = Array.isArray(returnToParam) ? returnToParam[0] : returnToParam;

  // get user
  const user = await getUser();

  // if the user already has a session, redirect the user
  if(user) {
    redirect(getReturnToUrl(returnTo));
  }

  // parse scopes
  const scopes = parseScopesOrDefault(scopesParam);

  // check if cookie exist to show logout message
  const cookieStore = await cookies();
  const showLogoutMessage = cookieStore.has('logout');

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.loginForm}>
          {error !== undefined && (
            <Notice type="error">Unknown error</Notice>
          )}

          {showLogoutMessage && (
            <Notice>Logout successful</Notice>
          )}

          <Headline id="login">Login</Headline>

          <p>
            Login to contribute to gw2treasures.com and to view your progression, inventory, and more.
          </p>

          <LoginButton scopes={scopes} returnTo={returnTo} logout={showLogoutMessage}/>

          <div className={styles.cookies}>
            <Icon icon="cookie"/>
            <p>By logging in you accept that gw2treasures.com will store cookies in your browser.</p>
          </div>
        </div>
        <aside className={styles.attribution}>
          TERRAFORM STUDIOS &copy; 2024 ArenaNet, LLC. All rights reserved.
        </aside>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: 'Login',
    alternates: getAlternateUrls('/login', language),
  };
}

const validScopes = new Set(Object.values(Scope));

function parseScopesOrDefault(scope: string | string[] | undefined): Scope[] {
  if(!scope) {
    return [Scope.Identify];
  }

  // parse scopes
  const parsedScopes = (Array.isArray(scope) ? scope : [scope])
    .flatMap((value) => value.split(','))
    .filter((scope): scope is Scope => validScopes.has(scope as Scope));

  // create set to deduplicate scopes
  const scopes = new Set(parsedScopes);

  // ensure Identify is always included
  scopes.add(Scope.Identify);

  // make sure account display names are included if accounts are included
  if(scopes.has(Scope.Accounts) || scopes.values().some((scope) => scope.startsWith('gw2:'))) {
    scopes.add(Scope.Accounts_DisplayName);
  }

  return Array.from(scopes);
}
