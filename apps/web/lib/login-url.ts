import { cookies } from 'next/headers';
import { getCurrentUrl } from './url';

export function getLoginUrlWithReturnTo() {
  const url = getCurrentUrl();

  return `/login?returnTo=${encodeURIComponent(url.pathname + url.search)}`;
}

export function getReturnToUrlFromCookie(): string {
  const cookie = cookies().get('RETURN_TO');
  cookies().delete('RETURN_TO');

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

export function setReturnToUrlCookie(returnTo?: string) {
  if(!returnTo) {
    return;
  }

  const currentUrl = getCurrentUrl();

  cookies().set('RETURN_TO', returnTo, {
    secure: currentUrl.protocol === 'https:',
    domain: currentUrl.hostname,
    path: '/auth/callback',
    httpOnly: true,
    maxAge: 60 * 15 // 15 minutes
  });
}
