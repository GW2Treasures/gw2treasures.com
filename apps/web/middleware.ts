import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const languages = ['de', 'en', 'es', 'fr'];
const baseDomain = process.env.GW2T_NEXT_DOMAIN;

export function middleware(request: NextRequest) {
  const domain = request.headers.get('host')?.split(':')[0];
  const language = languages.find((lang) => domain === `${lang}.${baseDomain}`);

  if(!language) {
    const protocol = request.headers.get('X-Forwarded-Proto')?.concat(':') ?? request.nextUrl.protocol;
    const port = request.headers.get('X-Forwarded-Port') ?? request.nextUrl.port;

    const url = `${protocol}//en.${baseDomain}:${port}${request.nextUrl.pathname}`;

    console.log(`> Redirecting to ${url}`);

    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${language}${url.pathname}`;

  return NextResponse.rewrite(url, { headers: corsHeader(request) });
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
