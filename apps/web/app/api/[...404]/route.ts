import { NextResponse } from 'next/server';
import type { PublicApiErrorResponse } from '..';

export function GET() {
  return NextResponse.json<PublicApiErrorResponse>(
    { error: 404, text: 'Not found' },
    { status: 404 }
  );
}
