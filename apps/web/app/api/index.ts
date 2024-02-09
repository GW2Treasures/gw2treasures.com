import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { getLanguage } from '@/components/I18n/getTranslate';

export interface PublicApiErrorResponse {
  error: number;
  text?: string;
}

export interface CallbackParams<DynamicRouteSegments> {
  params: DynamicRouteSegments;
  searchParams: Record<string, string>;
  language: Language
}

export interface CallbackResult<T = any> {
  status?: number,
  json?: T,
  stringAsJson?: string
}

export function publicApi<ResponseType, DynamicRouteSegments>(
  callback: (request: CallbackParams<DynamicRouteSegments>) => Promise<CallbackResult<ResponseType> | PublicApiErrorResponse>,
  { maxAge = 60 }: { maxAge?: number } = {}
): (
  request: NextRequest,
  context: { params: DynamicRouteSegments }
) => Promise<NextResponse<ResponseType | PublicApiErrorResponse>>
{
  return async (request, { params }) => {
    try {
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

      const language = getLanguage();

      const searchParams = request.nextUrl.searchParams;
      searchParams.delete('apiKey');
      searchParams.delete('lang');
      searchParams.sort();
      const searchParamsAsObject = Object.fromEntries(searchParams);

      // TODO: add cache
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
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${maxAge}`,
          'Access-Control-Allow-Origin': '*',
          'Vary': 'Authorization',
        }
      });
    } catch {
      return NextResponse.json<PublicApiErrorResponse>({ error: 500, text: 'Internal Server Error' }, { status: 500 });
    }
  };
}

function isPublicApiErrorResponse(response: CallbackResult | PublicApiErrorResponse): response is PublicApiErrorResponse {
  return 'error' in response;
}
