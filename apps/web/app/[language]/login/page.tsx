import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';
import { Icon } from '@gw2treasures/ui';
import { Scope } from '@gw2me/client';
import { getReturnToUrl } from '@/lib/login-url';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { PageProps } from '@/lib/next';
import { cookies } from 'next/headers';
import { LoginButton } from './login.client';
import styles from './page.module.css';
import { Trans } from '@/components/I18n/Trans';
import { getTranslate, translateMany } from '@/lib/translate';
import { createMetadata } from '@/lib/metadata';

export default async function LoginPage({ searchParams, params }: PageProps) {
  const { language } = await params;
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
            <Notice><Trans id="logout.success"/></Notice>
          )}

          <Headline id="login"><Trans id="login"/></Headline>

          <p>
            <Trans id="login.description"/>
          </p>

          <LoginButton scopes={scopes} returnTo={returnTo} logout={showLogoutMessage}
            translations={translateMany(['login.button', 'login.grant-all', 'login.grant-all.hint'], language)}/>

          <div className={styles.cookies} data-nosnippet>
            <Icon icon="cookie"/>
            <p><Trans id="login.cookies"/></p>
          </div>
        </div>
        <aside className={styles.attribution} data-nosnippet>
          TERRAFORM STUDIOS &copy; 2024 ArenaNet, LLC. All rights reserved.
        </aside>
      </div>
    </div>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('login'),
  };
});

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
