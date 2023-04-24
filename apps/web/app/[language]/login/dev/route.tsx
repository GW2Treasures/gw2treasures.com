import { notFound, redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getUrlFromParts, getUrlPartsFromRequest } from '@/lib/urlParts';
import { authCookie } from '@/lib/auth/cookie';

const baseDomain = process.env.GW2T_NEXT_DOMAIN;

export async function GET(request: NextRequest) {
  if(process.env.NODE_ENV === 'production') {
    notFound();
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name')?.trim();

  if(!name) {
    redirect('/login?error');
  }

  const { id } = await db.user.upsert({
    where: { name },
    create: { name },
    update: {}
  });

  const session = await db.userSession.create({ data: { info: 'Dev Login', userId: id }});

  // send response with session cookie
  const profileUrl = getUrlFromParts({ ...getUrlPartsFromRequest(request), path: '/profile' });
  const response = NextResponse.redirect(profileUrl);

  response.cookies.set(authCookie(session.id, false));

  return response;
}
