import { affiliateBuyGw2Url, affiliateTryGw2Url } from '@/lib/affiliate';
import type { NextMiddleware } from './types';
import { NextResponse } from 'next/server';

const redirectUrls: Record<string, string> = {
  '/buy-gw2': affiliateBuyGw2Url,
  '/try-gw2': affiliateTryGw2Url,
};

export const affiliateMiddleware: NextMiddleware = (request, next, data) => {
  const subdomain = data.subdomain;
  const isBot = request.headers.get('x-gw2t-is-bot') === '1';

  // get affiliate url if subdomain is unset
  const affiliateUrl = !subdomain && data.url
    ? redirectUrls[data.url.pathname]
    : undefined;

  // instantly redirect unless its a bot request
  if(affiliateUrl && !isBot) {
    console.log(`> Redirecting to ${affiliateUrl}`);
    return NextResponse.redirect(affiliateUrl);
  }

  return next(request);
};
