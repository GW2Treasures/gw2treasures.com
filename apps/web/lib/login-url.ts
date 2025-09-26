import { getCurrentUrl } from './url';
import type { Scope } from '@gw2me/client';

export async function getLoginUrlWithReturnTo(scopes?: Scope[]) {
  const url = await getCurrentUrl();

  const parameters = new URLSearchParams();
  parameters.append('returnTo', url.pathname + url.search);

  if(scopes) {
    parameters.append('scopes', scopes.join(','));
  }

  return `/login?${parameters.toString()}`;
}

export function getReturnToUrl(returnTo: string | undefined | null) {
  return isValidReturnToUrl(returnTo) ? returnTo : '/profile';
}

export function isValidReturnToUrl(returnTo: string | undefined | null): returnTo is string {
  // ensure returnTo is a relative url, but not protocol relative
  return !!returnTo && returnTo[0] === '/' && (returnTo.length === 1 || returnTo[1] !== '/');
}
