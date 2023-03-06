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

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
