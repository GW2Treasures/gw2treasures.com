import { NextResponse, NextRequest } from 'next/server';
import { healthMiddleware } from './proxy/health';
import type { NextMiddleware } from './proxy/types';
import { logMiddleware } from './proxy/log';
import { realUrlMiddleware } from './proxy/real-url';
import { subdomainMiddleware } from './proxy/subdomain';
import { languageMiddleware } from './proxy/language';
import { sessionMiddleware } from './proxy/session';
import { apiKeyMiddleware } from './proxy/api-key';
import { rewriteMiddleware } from './proxy/rewrite';
import { corsMiddleware } from './proxy/cors';
import { userAgentMiddleware } from './proxy/user-agent';
import { dropSearchParamsMiddleware } from './proxy/drop-search-params';
import { contentSecurityPolicyMiddleware } from './proxy/content-security-policy';
import { affiliateMiddleware } from './proxy/affiliate';

export async function proxy(request: NextRequest) {
  const middlewares: NextMiddleware[] = [
    logMiddleware,
    healthMiddleware,
    realUrlMiddleware,
    dropSearchParamsMiddleware,
    subdomainMiddleware,
    corsMiddleware,
    contentSecurityPolicyMiddleware,
    userAgentMiddleware,
    affiliateMiddleware,
    languageMiddleware,
    sessionMiddleware,
    apiKeyMiddleware,
    rewriteMiddleware,
  ];

  const data = {};

  let index = 0;
  const next = async (request: NextRequest) => {
    if (index < middlewares.length) {
      return await middlewares[index++](request, next, data);
    }

    return NextResponse.next({ request });
  };

  const response = await next(request);

  return response;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|android-chrome-[^/]+.png|apple-touch-icon.png|browserconfig.xml|favicon-[^/]+.png|mstile-[^/]+.png|safari-pinned-tab.svg|maskable_icon_[^/]+.png).*)',
};
