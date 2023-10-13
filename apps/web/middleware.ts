import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SessionCookieName } from './lib/auth/cookie';
import { Language } from '@gw2treasures/database';
import { getUrlFromRequest } from './lib/url';

const languages = ['de', 'en', 'es', 'fr'] as readonly Language[];
const subdomains = [...languages, 'api'] as const;
const baseDomain = process.env.GW2T_NEXT_DOMAIN;

export function middleware(request: NextRequest) {
  // healthcheck endpoint
  if(request.nextUrl.pathname === '/_/health') {
    return new NextResponse('UP');
  }

  // get original url before any proxies from request
  const url = getUrlFromRequest(request);

  // find the language by parsing the hostname
  const subdomain = subdomains.find((lang) => url.hostname === `${lang}.${baseDomain}`);

  // handle language not found
  if(!subdomain) {
    // if no language was detected we need to redirect to the correct domain
    url.hostname = `en.${baseDomain}`;

    // if we attempted to do this already, show error
    if(request.cookies.has('redirect_loop')) {
      return new NextResponse(`Could not redirect to ${url.toString()}.`, { status: 500 });
    }

    console.log(`> Redirecting to ${url}`);

    // create redirect
    const redirect = NextResponse.redirect(url);

    // set cookie to detect redirect loops
    redirect.cookies.set('redirect_loop', '1', { maxAge: 10 });

    // return redirect
    return redirect;
  }

  // set internal headers
  const headers = request.headers;

  // add real url to internal headers
  headers.set('x-gw2t-real-url', url.toString());

  if(subdomain !== 'api') {
    // handle normal language subdomains
    headers.set('x-gw2t-lang', subdomain);

    // set user session based on cookie
    if(request.cookies.has(SessionCookieName)) {
      const sessionId = request.cookies.get(SessionCookieName)!.value;

      headers.set('x-gw2t-session', sessionId);
    }
  } else {
    // handle api requests
    // set languae based on `lang` search param, fallback to en
    const lang = request.nextUrl.searchParams.get('lang');
    const isValidLang = lang && lang in Language;
    headers.set('x-gw2t-lang', isValidLang ? lang : 'en');

    // get api key
    const apiKey = getApiKeyFromRequest(request);
    if(apiKey) {
      headers.set('x-gw2t-apikey', apiKey);
    }
  }

  // prepend the internal url with the subdomain
  const internalUrl = request.nextUrl.clone();
  internalUrl.pathname = `/${subdomain}${url.pathname}`;

  // rewrite
  return NextResponse.rewrite(internalUrl, { headers: corsHeader(request), request: { headers }});
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
  matcher: '/((?!_next/static|_next/image|favicon.ico|android-chrome-[^/]+.png|apple-touch-icon.png|browserconfig.xml|favicon-[^/]+.png|mstile-[^/]+.png|robots.txt|safari-pinned-tab.svg|site.webmanifest|maskable_icon_[^/]+.png).*)',
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
