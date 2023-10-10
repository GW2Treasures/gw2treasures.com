import { remember } from '@/lib/remember';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export interface PublicApiErrorResponse {
  error: number;
  text?: string;
}

export function publicApi<ResponseType, DynamicRouteSegments>(
  callback: (params: DynamicRouteSegments, searchParams: Record<string, string>) => Promise<ResponseType>
): (
  request: NextRequest,
  context: { params: DynamicRouteSegments }
) => Promise<NextResponse<ResponseType | PublicApiErrorResponse>>
{
  const maxAge = 60;
  const cachedCallback = remember(maxAge, callback);

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
    const response = await cachedCallback(params, searchParamsAsObject);

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
