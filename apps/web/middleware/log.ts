import type { NextMiddleware } from './types';

declare module './types' {
  interface NextMiddlewareData {
    requestId: string;
  }
}

export const logMiddleware: NextMiddleware = async (request, next, data) => {
  const requestId = crypto.randomUUID();
  data.requestId = requestId;

  const ip = request.ip ?? request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for');

  console.log(`> [${requestId}] ${request.method} ${request.nextUrl.pathname}${request.nextUrl.search}${ip ? ` (${ip})` : ''}`);

  const response = await next(request);

  // console.log('<', requestId, Object.fromEntries(response.headers.entries()));
  response.headers.append('x-request-id', requestId);

  return response;
};
