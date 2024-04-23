import { getLanguage } from '@/lib/translate';
import { Language } from '@gw2treasures/database';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export function getCurrentUrl() {
  return new URL(headers().get('x-gw2t-real-url')!);
}

export function getUrlFromRequest(request: Request) {
  const url = new URL(request.url);
  url.host = request.headers.get('Host')?.split(':')[0] ?? url.host;
  url.port = request.headers.get('X-Forwarded-Port')?.split(',')[0] ?? url.port;
  url.protocol = request.headers.get('X-Forwarded-Proto')?.split(',')[0].concat(':') ?? url.protocol;

  return url;
}

export function absoluteUrl(href: string) {
  return new URL(href, getCurrentUrl());
}

const baseDomain = process.env.GW2T_NEXT_DOMAIN!;
const allLanguages = ['x-default', ...Object.values(Language)] as const;

export function getAlternateUrls(path: string) {
  // get current language and url
  const currentLanguage = getLanguage();
  const currentUrl = getCurrentUrl();

  // normalize current url
  currentUrl.search = '';
  currentUrl.pathname = '';

  // build canonical url
  const canonical = new URL(path, currentUrl);

  // build alternate languages
  const alternates = allLanguages.filter(
    (language) => language !== currentLanguage
  ).map<[language: string, domain: string]>(
    (language) => [language, language === 'x-default' ? baseDomain : `${language}.${baseDomain}`]
  ).map<[language: string, url: string]>(
    ([language, domain]) => {
      const url = new URL(canonical);
      url.hostname = domain;
      return [language, url.toString()];
    }
  );

  // return metadata
  return {
    canonical: canonical.toString(),
    languages: Object.fromEntries(alternates)
  } satisfies Metadata['alternates'];
}
