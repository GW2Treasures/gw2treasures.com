'use server';
import { gw2me } from '@/lib/gw2me';
import { setReturnToUrlCookie } from '@/lib/login-url';
import { getCurrentUrl } from '@/lib/url';
import { Scope, type AuthorizationUrlParams } from '@gw2me/client';
import { redirect } from 'next/navigation';
import 'server-only';

// eslint-disable-next-line require-await
export async function reauthorize(requiredScopes: Scope[], prompt?: AuthorizationUrlParams['prompt']) {

  // build redirect url
  const currentUrl = getCurrentUrl();
  const redirect_uri = new URL('/auth/callback', currentUrl).toString();

  // get scopes
  const scopes = Array.from(new Set([Scope.Identify, Scope.Email, Scope.Accounts, Scope.Accounts_DisplayName, ...requiredScopes]));

  // get gw2.me auth url
  const url = gw2me.getAuthorizationUrl({ redirect_uri, scopes, prompt, include_granted_scopes: true });

  // add cookie for return
  setReturnToUrlCookie(currentUrl.pathname);

  // redirect to gw2.me
  redirect(url);
}
