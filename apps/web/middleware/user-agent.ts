import { userAgent } from 'next/server';
import type { NextMiddleware } from './types';

export const userAgentMiddleware: NextMiddleware = (request, next) => {
  const ua = userAgent(request);

  request.headers.append('x-gw2t-is-bot', ua.isBot ? '1' : '0');

  return next(request);
};
