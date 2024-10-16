import { NextRequest } from 'next/server';
import { db } from '@/lib/prisma';
import { SessionCookieName, authCookie } from '@/lib/auth/cookie';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(SessionCookieName)?.value ?? '';

  if(sessionId) {
    await db.userSession.deleteMany({ where: { id: sessionId }});
  }

  (await cookies()).delete(authCookie(''));
  return redirect('/login?logout');
}
