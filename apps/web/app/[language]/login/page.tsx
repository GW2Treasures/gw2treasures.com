import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';
import { Icon } from '@gw2treasures/ui';
import { Scope } from '@gw2me/client';
import { gw2me } from '@/lib/gw2me';
import { getAlternateUrls, getCurrentUrl } from '@/lib/url';
import { getReturnToUrl, setReturnToUrlCookie } from '@/lib/login-url';
import type { Metadata } from 'next';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Trans } from '@/components/I18n/Trans';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import type { PageProps } from '@/lib/next';
import { cookies } from 'next/headers';

export default async function LoginPage({ searchParams }: PageProps) {
  const { returnTo: returnToParam, scopes: scopesParam, error } = await searchParams;
  const user = await getUser();
  const returnTo = Array.isArray(returnToParam) ? returnToParam[0] : returnToParam;
  const scopes = Array.isArray(scopesParam) ? scopesParam.join(',') : scopesParam;

  if(user) {
    redirect(getReturnToUrl(returnTo));
  }

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

      <form action={redirectToGw2Me.bind(null, returnTo, scopes)}>
        <SubmitButton icon="gw2me" iconColor="#b7000d" type="submit">Login with gw2.me</SubmitButton>
      </form>

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

async function redirectToGw2Me(returnTo?: string, additionalScopes?: string) {
  'use server';

  // build redirect url
  const redirect_uri = new URL('/auth/callback', await getCurrentUrl()).toString();

  // get scopes to request from gw2.me
  const scopes = getScopesFromString(additionalScopes);

  // get gw2.me auth url
  const url = gw2me.getAuthorizationUrl({ redirect_uri, scopes, include_granted_scopes: true });

  // set cookie with url to return to after auth
  await setReturnToUrlCookie(returnTo);

  // redirect to gw2.me
  redirect(url);
}

function getScopesFromString(scopeString?: string) {
  // valid scope values to validate the provided scopes against
  const validScopes: string[] = Object.values(Scope);

  // default scopes that are always requested
  const scopes = new Set([Scope.Identify]);

  // parse scopes
  const parsedScopes = scopeString?.split(',') ?? [];

  // add all valid scopes to the scopes set
  for(const scope of parsedScopes) {
    if(validScopes.includes(scope)) {
      scopes.add(scope as Scope);
    }
  }

  // return the array of scopes to request
  return Array.from(scopes);
}
