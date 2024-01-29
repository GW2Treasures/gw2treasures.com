import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { cache } from '@/lib/cache';

export interface PublicApiErrorResponse {
  error: number;
  text?: string;
}

export function publicApi<ResponseType, DynamicRouteSegments>(
  callback: (params: DynamicRouteSegments, searchParams: Record<string, string>) => Promise<ResponseType>,
  { maxAge = 60 }: { maxAge?: number } = {}
): (
  request: NextRequest,
  context: { params: DynamicRouteSegments }
) => Promise<NextResponse<ResponseType | PublicApiErrorResponse>>
{
  return async (request, { params }) => {
    // verify api key
    const apiKey = headers().get('x-gw2t-apikey');
    if(!apiKey) {
      return NextResponse.json(
        { error: 401, text: 'Missing API key' },
        { status: 401 }
      );
    }
    const application = await db.application.findUnique({ where: { apiKey }});

    if(!application) {
      return NextResponse.json(
        { error: 401, text: 'Invalid API key' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    searchParams.delete('apiKey');
    searchParams.sort();
    const searchParamsAsObject = Object.fromEntries(searchParams);

    // get reponse
    const response = await cache(() => {
      return callback(params, searchParamsAsObject);
    }, ['web-api-request', request.nextUrl.toString()], { revalidate: maxAge })();

    // return new response
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': `public, max-age=${maxAge}`,
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Authorization',
      }
    });
  };
}
