import { getBaseUrl } from '@/lib/url';
import type { NextMiddleware } from './types';
import { Language } from '@gw2treasures/database';
import { NextResponse } from 'next/server';

type Subdomain = Language | 'api';
const validSubdomains: Subdomain[] = ['api', ...Object.values(Language)];

declare module './types' {
  interface NextMiddlewareData {
    subdomain: Subdomain,
  }
}

export const subdomainMiddleware: NextMiddleware = (request, next, data) => {
  const url = data.url;

  if(!url) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  // find the subdomain by parsing the hostname
  const subdomain = validSubdomains.find((subdomain) => url.hostname === getBaseUrl(subdomain).hostname);
  data.subdomain = subdomain;

  return next(request);
};
