import { NextResponse } from 'next/server';
import { NextMiddleware } from './types';

export const rewriteMiddleware: NextMiddleware = (request, next, { subdomain }) => {
  // prepend the internal url with the subdomain
  const internalUrl = request.nextUrl.clone();
  internalUrl.pathname = `/${subdomain ?? 'www'}${internalUrl.pathname}`;

  return NextResponse.rewrite(internalUrl, { request });
};
