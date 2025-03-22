'use server';

import { gw2me } from '@/lib/gw2me';
import { getCurrentUrl } from '@/lib/url';
import { Scope, type AuthorizationUrlParams } from '@gw2me/client';
import { prepareAuthRequest } from 'app/[language]/login/login.action';
import { redirect } from 'next/navigation';
import 'server-only';

export async function reauthorize(requiredScopes: Scope[], prompt?: AuthorizationUrlParams['prompt']) {
  // build redirect url
  const currentUrl = await getCurrentUrl();
  const redirect_uri = new URL('/auth/callback', currentUrl).toString();

  // get scopes
  const scopes = Array.from(new Set([Scope.Identify, Scope.Accounts, Scope.Accounts_DisplayName, ...requiredScopes]));

  const auth = await prepareAuthRequest(currentUrl.pathname + currentUrl.search);

  // get gw2.me auth url
  const url = gw2me.getAuthorizationUrl({
    redirect_uri,
    scopes,
    prompt,
    include_granted_scopes: true,
    state: auth.state,
    ...auth.pkce,
  });

  // redirect to gw2.me
  redirect(url);
}
