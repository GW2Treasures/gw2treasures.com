import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getUrlPartsFromRequest } from '@/lib/getUrlPartsFromRequest';

const baseDomain = process.env.GW2T_NEXT_DOMAIN;

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get('gw2t-session')?.value ?? '';

  if(sessionId) {
    await db.userSession.deleteMany({ where: { id: sessionId }});
  }

  const { domain, protocol, port } = getUrlPartsFromRequest(request);
  const response = NextResponse.redirect(`${protocol}//${domain}:${port}/login?logout`);
  response.cookies.set('gw2t-session', '', { domain: baseDomain, sameSite: 'lax', httpOnly: true, secure: protocol === 'https', maxAge: 0, expires: new Date(0) });

  return response;
}
