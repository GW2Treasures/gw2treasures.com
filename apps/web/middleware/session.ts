import type { NextMiddleware } from './types';
import { SessionCookieName } from '@/lib/auth/cookie';

export const sessionMiddleware: NextMiddleware = (request, next, data) => {
  // set user session based on cookie
  const cookie = request.cookies.get(SessionCookieName);

  if(cookie) {
    request.headers.set('x-gw2t-session', cookie.value);
  }

  return next(request);
};
