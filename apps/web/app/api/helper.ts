import { NextResponse } from 'next/server';

export type UnwrapJsonResponse<T extends PromiseLike<NextResponse<any>> | NextResponse<any>> =
  T extends PromiseLike<NextResponse<infer X>> ? X
    : T extends NextResponse<infer X> ? X : never;

