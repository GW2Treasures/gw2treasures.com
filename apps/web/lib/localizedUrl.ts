import type { Language } from '@gw2treasures/database';

export function localizedUrl(href: string, language: Language) {
  // get base url from env variable on server or html[data-base-url] on client
  const baseUrl = process.env.GW2T_URL ?? document.documentElement.dataset.baseUrl!;

  const base = new URL(baseUrl);
  base.hostname = `${language}.${base.hostname}`;

  return new URL(href, base).toString();
}
