import { NextResponse } from 'next/server';
import { NextMiddleware } from './types';

export const healthMiddleware: NextMiddleware = (request, next, data) => {
  if(request.nextUrl.pathname === '/_/health') {
    return new NextResponse('UP');
  }

  return next(request);
};
