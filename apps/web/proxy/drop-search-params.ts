import type { NextMiddleware } from './types';
import { NextResponse } from 'next/server';

// old query parameters used by legacy.gw2treasures.com that should be dropped from the url
const dropSearchParams = [
  'showSimilar',
  '_redirectedFromOldDomain'
];

export const dropSearchParamsMiddleware: NextMiddleware = (request, next, data) => {
  const url = data.url;

  if(!url) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  if(dropSearchParams.some((param) => url.searchParams.has(param))) {
    const redirectUrl = new URL(url);
    dropSearchParams.forEach((param) => redirectUrl.searchParams.delete(param));

    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  return next(request);
};
