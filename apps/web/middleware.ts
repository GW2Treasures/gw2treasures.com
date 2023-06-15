import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUrlFromParts, getUrlPartsFromRequest } from './lib/urlParts';
import { SessionCookieName } from './lib/auth/cookie';
import { Language } from '@gw2treasures/database';

const languages = ['de', 'en', 'es', 'fr'] as readonly Language[];
const subdomains = [...languages, 'api'] as const;
const baseDomain = process.env.GW2T_NEXT_DOMAIN;

export function middleware(request: NextRequest) {
  if(request.nextUrl.pathname === '/_/health') {
    return new NextResponse('UP');
  }

  const { domain, protocol, port, path } = getUrlPartsFromRequest(request);
  const realUrl = getUrlFromParts({ domain, protocol, port, path });

  const language = subdomains.find((lang) => domain === `${lang}.${baseDomain}`);

  if(!language) {
    const url = getUrlFromParts({ protocol, domain: `en.${baseDomain}`, port, path });

    console.log(`> Redirecting to ${url}`);

    return NextResponse.redirect(url);
  }

  const headers = request.headers;
  headers.set('x-gw2t-real-url', realUrl);

  // set custom headers
  if(language !== 'api') {
    // handle normal language subdomains
    headers.set('x-gw2t-lang', language);

    // set user session based on cookie
    if(request.cookies.has(SessionCookieName)) {
      const sessionId = request.cookies.get(SessionCookieName)!.value;

      headers.set('x-gw2t-session', sessionId);
    }
  } else {
    // handle api requests
    const lang = request.nextUrl.searchParams.get('lang')!;

    if(languages.includes(lang as any)) {
      headers.set('x-gw2t-lang', lang);
    } else {
      headers.set('x-gw2t-lang', 'en');
    }

    // get api key
    const apiKey = getApiKeyFromRequest(request);
    if(apiKey) {
      headers.set('x-gw2t-apikey', apiKey);
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${language}${url.pathname}`;

  return NextResponse.rewrite(url, { headers: corsHeader(request), request: { headers }});
}

function corsHeader(request: NextRequest): {} | { 'Access-Control-Allow-Origin': string } {
  const origin = request.headers.get('Origin');

  if(!origin) {
    return {};
  }

  const regex = new RegExp(`^https?://(${languages.join('|')})\.${baseDomain?.replace('.', '\.')}`);
  const isAllowed = origin.match(regex);

  if(isAllowed) {
    return {
      'Access-Control-Allow-Origin': origin,

      // `Vary: Origin` is required, because otherwise `Access-Control-Allow-Origin` is cached for wrong origins
      // nextjs currently doesn't support setting `Vary` in middleware (https://github.com/vercel/next.js/issues/48480)
      // so every relevant endpoint needs to set `Vary: Origin` on the response.
      'Vary': 'Origin'
    };
  }

  throw new Error('CORS');
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

function getApiKeyFromRequest(request: NextRequest): string | undefined {
  if(request.headers.has('Authorization')) {
    const authorizationHeader = request.headers.get('Authorization')!;
    const [type, key] = authorizationHeader.split(' ');

    if(type === 'Bearer') {
      return key;
    }

    return undefined;
  }

  if(request.nextUrl.searchParams.has('apiKey')) {
    const apiKey = request.nextUrl.searchParams.get('apiKey');

    return apiKey ?? undefined;
  }

  return undefined;
}
