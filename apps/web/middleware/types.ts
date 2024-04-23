import { NextRequest, NextResponse } from 'next/server';

export interface NextMiddlewareData {}

export type NextMiddleware = (request: NextRequest, next: ((request: NextRequest) => Promise<NextResponse>), data: Partial<NextMiddlewareData>) => Promise<NextResponse> | NextResponse;
