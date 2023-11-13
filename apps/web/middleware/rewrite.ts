import { NextResponse } from 'next/server';
import type { NextMiddleware } from './types';

export const rewriteMiddleware: NextMiddleware = (request, next, { subdomain }) => {
  // skip robots.txt, because next.js requires the corresponding robots.ts in the root directory
  if(request.nextUrl.pathname === '/robots.txt') {
    return next(request);
  }

  // prepend the internal url with the subdomain
  const internalUrl = request.nextUrl.clone();
  internalUrl.pathname = `/${subdomain ?? 'www'}${internalUrl.pathname}`;

  return NextResponse.rewrite(internalUrl, { request });
};
