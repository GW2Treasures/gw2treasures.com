import { NextResponse } from 'next/server';
import type { PublicApiErrorResponse } from '..';
import { getBaseUrl } from '@/lib/url';

export function GET() {
  const documentation = new URL('/dev/api', getBaseUrl());

  return NextResponse.json<PublicApiErrorResponse>(
    { error: 404, text: `Endpoint not found. See ${documentation.toString()} for a list of all endpoints.` },
    { status: 404 }
  );
}
