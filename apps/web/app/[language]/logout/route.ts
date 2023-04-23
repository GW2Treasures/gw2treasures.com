import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getUrlFromParts, getUrlPartsFromRequest } from '@/lib/urlParts';

const baseDomain = process.env.GW2T_NEXT_DOMAIN;

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get('gw2t-session')?.value ?? '';

  if(sessionId) {
    await db.userSession.deleteMany({ where: { id: sessionId }});
  }

  // build login url
  const parts = getUrlPartsFromRequest(request);
  const loginUrl = getUrlFromParts({ ...parts, path: '/login?logout' });

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set('gw2t-session', '', { domain: baseDomain, sameSite: 'lax', httpOnly: true, secure: parts.protocol === 'https:', maxAge: 0, expires: new Date(0) });

  return response;
}
