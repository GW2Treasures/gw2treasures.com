import type { NextMiddleware } from './types';

declare module './types' {
  interface NextMiddlewareData {
    requestId: string;
  }
}

export const logMiddleware: NextMiddleware = async (request, next, data) => {
  const requestId = crypto.randomUUID();
  data.requestId = requestId;

  console.log(`> [${requestId}] ${request.method} ${request.nextUrl.pathname}${request.nextUrl.search}`);

  const response = await next(request);

  // console.log('<', requestId, Object.fromEntries(response.headers.entries()));
  response.headers.append('x-request-id', requestId);

  return response;
};
