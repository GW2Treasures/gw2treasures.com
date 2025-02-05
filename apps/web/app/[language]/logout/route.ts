import { NextRequest } from 'next/server';
import { db } from '@/lib/prisma';
import { authCookieSettings, SessionCookieName } from '@/lib/auth/cookie';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  // get session from cookie
  // TODO: why not use `x-gw2t-session` header?
  const sessionId = request.cookies.get(SessionCookieName)?.value ?? '';

  if(sessionId) {
    // try to delete session in db
    await db.userSession.deleteMany({ where: { id: sessionId }});
  }

  // delete cookie
  (await cookies()).delete(authCookieSettings);

  // redirect user to login page
  // TODO: replace `?logout` with cookie to show message?
  return redirect('/login?logout');
}
