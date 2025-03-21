import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';
import { Icon } from '@gw2treasures/ui';
import { Scope } from '@gw2me/client';
import { getAlternateUrls } from '@/lib/url';
import { getReturnToUrl } from '@/lib/login-url';
import type { Metadata } from 'next';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Trans } from '@/components/I18n/Trans';
import type { PageProps } from '@/lib/next';
import { cookies } from 'next/headers';
import { LoginButton } from './login.client';
import { client_id } from '@/lib/gw2me';

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
  const scope = parseScopeOrDefault(scopesParam);

  // check if cookie exist to show logout message
  const cookieStore = await cookies();
  const showLogoutMessage = cookieStore.has('logout');

  return (
    <HeroLayout hero={<Headline id="login"><Trans id="login"/></Headline>}>
      {error !== undefined && (
        <Notice type="error">Unknown error</Notice>
      )}

      {showLogoutMessage && (
        <Notice>Logout successful</Notice>
      )}

      <p>
        Login to contribute to gw2treasures.com and to view your progression, inventory, and more.
      </p>

      <LoginButton scope={scope} returnTo={returnTo} logout={showLogoutMessage} clientId={client_id} gw2meBaseUrl={process.env.GW2ME_URL}/>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: 2, marginTop: 32 }}>
        <Icon icon="cookie"/>
        <p>By logging in you accept that gw2treasures.com will store cookies in your browser.</p>
      </div>
    </HeroLayout>
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

function parseScopeOrDefault(scope: string | string[] | undefined): Scope[] {
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
