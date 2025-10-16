import { NextRequest } from 'next/server';
import type { NextMiddleware } from './types';

export const apiKeyMiddleware: NextMiddleware = (request, next, data) => {
  const subdomain = data.subdomain;

  if(subdomain === 'api') {
    // get api key
    const apiKey = getApiKeyFromRequest(request);

    if(apiKey) {
      request.headers.set('x-gw2t-apikey', apiKey);
    }
  }

  return next(request);
};

function getApiKeyFromRequest(request: NextRequest): string | undefined {
  if(request.headers.has('Authorization')) {
    const authorizationHeader = request.headers.get('Authorization')!;
    const [type, key] = authorizationHeader.split(' ');

    if(type === 'Bearer') {
      return key;
    }

    return undefined;
  }

  if(request.nextUrl.searchParams.has('apiKey')) {
    const apiKey = request.nextUrl.searchParams.get('apiKey');

    return apiKey ?? undefined;
  }

  return undefined;
}
