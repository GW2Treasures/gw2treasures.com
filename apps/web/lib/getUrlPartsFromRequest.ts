import { NextRequest } from 'next/server';

export function getUrlPartsFromRequest(request: NextRequest) {
  const domain = request.headers.get('Host')?.split(':')[0];
  const protocol = request.headers.get('X-Forwarded-Proto')?.concat(':') ?? request.nextUrl.protocol;
  const port = request.headers.get('X-Forwarded-Port') ?? request.nextUrl.port;

  return { domain, protocol, port };
}
