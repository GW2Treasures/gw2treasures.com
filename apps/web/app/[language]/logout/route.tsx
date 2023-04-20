import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

const baseDomain = process.env.GW2T_NEXT_DOMAIN!;

export async function GET(request: NextRequest) {
  const domain = request.headers.get('host')?.split(':')[0];
  const protocol = request.headers.get('X-Forwarded-Proto')?.concat(':') ?? request.nextUrl.protocol;
  const port = request.headers.get('X-Forwarded-Port') ?? request.nextUrl.port;

  const response = NextResponse.redirect(`${protocol}//${domain}:${port}/login?logout`);

  const sessionId = request.cookies.get('gw2t-session')?.value ?? '';
  if(sessionId) {
    await db.userSession.delete({ where: { id: sessionId }});
  }

  response.cookies.set('gw2t-session', '', { domain: baseDomain, sameSite: 'lax', httpOnly: true, secure: protocol === 'https', maxAge: 0, expires: new Date(0) });

  return response;
}
