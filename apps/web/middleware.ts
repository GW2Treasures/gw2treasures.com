import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUrlFromParts, getUrlPartsFromRequest } from './lib/urlParts';

const languages = ['de', 'en', 'es', 'fr'];
const baseDomain = process.env.GW2T_NEXT_DOMAIN;

export function middleware(request: NextRequest) {
  const { domain, protocol, port, path } = getUrlPartsFromRequest(request);
  const language = languages.find((lang) => domain === `${lang}.${baseDomain}`);

  if(!language) {
    const url = getUrlFromParts({ protocol, domain: `en.${baseDomain}`, port, path });

    console.log(`> Redirecting to ${url}`);

    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${language}${url.pathname}`;

  const headers = request.headers;
  headers.append('x-gw2t-lang', language);

  // get session
  if(request.cookies.has('gw2t-session')) {
    const sessionId = request.cookies.get('gw2t-session')!.value;

    headers.append('x-gw2t-session', sessionId);
  }

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
    return { 'Access-Control-Allow-Origin': origin };
  }

  throw new Error('CORS');
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
