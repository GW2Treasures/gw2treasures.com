import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { healthMiddleware } from './middleware/health';
import type { NextMiddleware } from './middleware/types';
import { logMiddleware } from './middleware/log';
import { realUrlMiddleware } from './middleware/real-url';
import { subdomainMiddleware } from './middleware/subdomain';
import { languageMiddleware } from './middleware/language';
import { sessionMiddleware } from './middleware/session';
import { apiKeyMiddleware } from './middleware/api-key';
import { rewriteMiddleware } from './middleware/rewrite';
import { corsMiddleware } from './middleware/cors';
import { userAgentMiddleware } from './middleware/user-agent';

export async function middleware(request: NextRequest) {
  const middlewares: NextMiddleware[] = [
    logMiddleware,
    healthMiddleware,
    corsMiddleware,
    realUrlMiddleware,
    subdomainMiddleware,
    languageMiddleware,
    userAgentMiddleware,
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
  matcher: '/((?!_next/static|_next/image|favicon.ico|android-chrome-[^/]+.png|apple-touch-icon.png|browserconfig.xml|favicon-[^/]+.png|mstile-[^/]+.png|safari-pinned-tab.svg|site.webmanifest|maskable_icon_[^/]+.png).*)',
};
