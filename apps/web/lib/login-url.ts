import { cookies } from 'next/headers';
import { getCurrentUrl } from './url';
import type { Scope } from '@gw2me/client';

export async function getLoginUrlWithReturnTo(scopes?: Scope[]) {
  const url = await getCurrentUrl();

  const parameters = new URLSearchParams();
  parameters.append('returnTo', url.pathname);

  if(scopes) {
    parameters.append('scopes', scopes.join(','));
  }

  return `/login?${parameters.toString()}`;
}

export async function getReturnToUrlFromCookie(): Promise<string> {
  const cookieStore = await cookies();

  const cookie = cookieStore.get('RETURN_TO');
  cookieStore.delete('RETURN_TO');

  return getReturnToUrl(cookie?.value);
}

export function getReturnToUrl(returnTo?: string) {
  if(returnTo && returnTo.startsWith('/')) {
    // make sure the return to cookie does not start with a `//`, this could be an 'protocol relative' absolute url
    if(returnTo === '/' || returnTo[1] !== '/') {
      return returnTo;
    }
  }

  return '/profile';
}

export async function setReturnToUrlCookie(returnTo?: string) {
  if(!returnTo) {
    return;
  }

  const currentUrl = await getCurrentUrl();

  (await cookies()).set('RETURN_TO', returnTo, {
    secure: true,
    domain: currentUrl.hostname,
    path: '/auth/callback',
    httpOnly: true,
    maxAge: 60 * 15 // 15 minutes
  });
}
