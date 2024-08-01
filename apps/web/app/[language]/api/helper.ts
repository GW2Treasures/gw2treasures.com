import { NextResponse } from 'next/server';

export type UnwrapJsonResponse<T extends PromiseLike<NextResponse<unknown>> | NextResponse<unknown>> =
  T extends PromiseLike<NextResponse<infer X>> ? X
    : T extends NextResponse<infer X> ? X : never;
