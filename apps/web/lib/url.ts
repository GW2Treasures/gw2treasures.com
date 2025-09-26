import { Language } from '@gw2treasures/database';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getLanguage } from './translate';

const baseUrl: undefined | Readonly<URL> = process.env.GW2T_URL ? new URL(process.env.GW2T_URL) : undefined;

export function getBaseUrl(subdomain?: Language | 'api'): Readonly<URL> {
  if(!baseUrl) {
    throw new Error('Missing required environment variable GW2T_URL');
  }

  if(!subdomain) {
    return baseUrl;
  }

  const localizedUrl = new URL(baseUrl);
  localizedUrl.hostname = `${subdomain}.${localizedUrl.hostname}`;

  return localizedUrl;
}

export async function getCurrentBaseUrl() {
  const language = await getLanguage();
  return getBaseUrl(language);
}

/** @deprecated Use `getBaseUrl` or `getCurrentBaseUrl` instead */
export async function getCurrentUrl() {
  return new URL((await headers()).get('x-gw2t-real-url')!);
}

export function getUrlFromRequest(request: Request) {
  const url = new URL(request.url);
  url.host = request.headers.get('Host')?.split(':')[0] ?? url.host;
  url.port = request.headers.get('X-Forwarded-Port')?.split(',')[0] ?? url.port;
  url.protocol = request.headers.get('X-Forwarded-Proto')?.split(',')[0].concat(':') ?? url.protocol;

  return url;
}

export async function absoluteUrl(href: string) {
  return new URL(href, await getCurrentBaseUrl());
}

const allLanguages = ['x-default', ...Object.values(Language)] as const;

export function getAlternateUrls(path: string, currentLanguage: Language) {
  // build canonical url
  const canonical = new URL(path, getBaseUrl(currentLanguage));

  // build alternate languages
  const alternates = allLanguages.filter(
    (language) => language !== currentLanguage
  ).map<[language: string, base: URL]>(
    (language) => [language, language === 'x-default' ? getBaseUrl() : getBaseUrl(language)]
  ).map<[language: string, url: string]>(
    ([language, base]) => {
      const url = new URL(path, base);
      return [language, url.toString()];
    }
  );

  // return metadata
  return {
    canonical: canonical.toString(),
    languages: Object.fromEntries(alternates)
  } satisfies Metadata['alternates'];
}
