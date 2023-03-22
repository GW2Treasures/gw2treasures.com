import { NextResponse } from 'next/server';

export interface JsonResponse<T> extends NextResponse {};
export type UnwrapJsonResponse<T extends PromiseLike<JsonResponse<any>> | JsonResponse<any>> =
  T extends PromiseLike<JsonResponse<infer X>> ? X
    : T extends JsonResponse<infer X> ? X : never;

export function jsonResponse<T>(data: T): JsonResponse<T> {
  return NextResponse.json(data);
}

