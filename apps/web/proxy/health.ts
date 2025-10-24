import { NextResponse } from 'next/server';
import type { NextMiddleware } from './types';

export const healthMiddleware: NextMiddleware = (request, next) => {
  if(request.nextUrl.pathname === '/_/health') {
    return new NextResponse('UP');
  }

  return next(request);
};
