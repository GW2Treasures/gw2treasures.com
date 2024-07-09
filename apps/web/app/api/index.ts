import { headers } from 'next/headers';
import { NextRequest, NextResponse, unstable_after } from 'next/server';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { getLanguage } from '@/lib/translate';

export interface PublicApiErrorResponse {
  error: number;
  text?: string;
}

export interface CallbackParams<DynamicRouteSegments extends string = never> {
  params: Record<DynamicRouteSegments, string>;
  searchParams: Record<string, string>;
  language: Language
}

export interface CallbackResult<T = any> {
  status?: number,
  header?: Record<string, string>
  json?: T,
  stringAsJson?: string
}

export type PublicApiResponse<T = any> = CallbackResult<T> | PublicApiErrorResponse

export function publicApi<DynamicRouteSegments extends string = never, ResponseType = any>(
  endpoint: string,
  callback: (request: CallbackParams<DynamicRouteSegments>) => PublicApiResponse<ResponseType> | Promise<PublicApiResponse<ResponseType>>,
  { maxAge = 60 }: { maxAge?: number } = {}
): (
  request: NextRequest,
  context: { params: Record<DynamicRouteSegments, string> }
) => Promise<NextResponse<ResponseType | PublicApiErrorResponse>>
{
  return async (request, { params }) => {
    try {
      // get request id
      const requestId = headers().get('x-request-id');

      if(!requestId) {
        throw new Error('Missing x-request-id header');
      }

      // verify api key
      const apiKey = headers().get('x-gw2t-apikey');
      if(!apiKey) {
        return NextResponse.json(
          { error: 401, text: 'Missing API key' },
          { status: 401, headers: { 'Access-Control-Allow-Origin': '*' }}
        );
      }

      const application = await db.application.findUnique({ where: { apiKey }});

      if(!application) {
        return NextResponse.json(
          { error: 401, text: 'Invalid API key' },
          { status: 401, headers: { 'Access-Control-Allow-Origin': '*' }}
        );
      }

      // log request to database
      await db.applicationApiRequest.create({
        data: {
          requestId,
          applicationId: application.id,
          endpoint,
        }
      });

      const language = getLanguage();

      const searchParams = request.nextUrl.searchParams;
      searchParams.delete('apiKey');
      searchParams.delete('lang');
      searchParams.sort();
      const searchParamsAsObject = Object.fromEntries(searchParams);

      // TODO: add global cache here instead of caching inside the callback?
      const response = await callback({ params, searchParams: searchParamsAsObject, language });

      if(isPublicApiErrorResponse(response)) {
        return NextResponse.json(response, {
          status: response.error,
          headers: {
            'Cache-Control': 'public, max-age=60',
            'Access-Control-Allow-Origin': '*',
            'Vary': 'Authorization',
          }
        });
      }

      // return new response
      return new NextResponse(response.stringAsJson ?? JSON.stringify(response.json), {
        status: response.status ?? 200,
        headers: {
          ...response.header,
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${maxAge}`,
          'Access-Control-Allow-Origin': '*',
          'Vary': 'Authorization',
        }
      });
    } catch {
      return NextResponse.json<PublicApiErrorResponse>(
        { error: 500, text: 'Internal Server Error' },
        { status: 500, headers: { 'Access-Control-Allow-Origin': '*' }}
      );
    }
  };
}

function isPublicApiErrorResponse(response: CallbackResult | PublicApiErrorResponse): response is PublicApiErrorResponse {
  return 'error' in response;
}
