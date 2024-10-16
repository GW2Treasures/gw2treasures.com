import { Language } from '@gw2treasures/database';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export function getCurrentUrl() {
  return new URL(headers().get('x-gw2t-real-url')!);
}

/**
 * Check if the application is currently server with HTTPS,
 * determined by the HTTPS environment variable. If HTTPS is unset,
 * it defaults to true in NODE_ENV = production, otherwise false
 */
export function isHttps() {
  return process.env.HTTPS !== undefined
    ? process.env.HTTPS === '1'
    : process.env.NODE_ENV === 'production';
}

const baseDomain = process.env.GW2T_NEXT_DOMAIN!;

export function getBaseUrl(subdomain?: Language | 'api') {
  const protocol = isHttps() ? 'https:' : 'http:';
  const domainParts = subdomain ? [subdomain, baseDomain] : [baseDomain];

  return new URL(`${protocol}//${domainParts.join('.')}`);
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

const allLanguages = ['x-default', ...Object.values(Language)] as const;

export function getAlternateUrls(path: string, currentLanguage: Language) {
  // build canonical url
  const canonical = new URL(path, getBaseUrl(currentLanguage));

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
