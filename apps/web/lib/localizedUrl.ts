import type { Language } from '@gw2treasures/database';

export function localizedUrl(href: string, language: Language) {
  const base = process.env.GW2T_NEXT_DOMAIN;

  if(typeof window === 'undefined') {
    // TODO: server side
    const url = new URL(href, `http://${language}.${base}/`);
    return url.href;
  }

  const currentUrl = new URL(window.location.href);

  const newUrl = new URL(href, currentUrl);
  newUrl.hostname = language + currentUrl.hostname.substring(2);

  return newUrl.href;
}
