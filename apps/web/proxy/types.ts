import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NextMiddlewareData {}

export type NextMiddleware = (request: NextRequest, next: ((request: NextRequest) => Promise<NextResponse>), data: Partial<NextMiddlewareData>) => Promise<NextResponse> | NextResponse;
