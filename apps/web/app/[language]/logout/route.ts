import { db } from '@/lib/prisma';
import { authCookieSettings, SessionCookieName } from '@/lib/auth/cookie';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  if(!cookieStore.has(SessionCookieName)) {
    // if there is no session cookie, redirect user to login page
    redirect('/login');
  }

  const sessionId = cookieStore.get(SessionCookieName)!.value;

  // try to delete session in db
  if(sessionId) {
    await db.userSession.deleteMany({ where: { id: sessionId }});
  }

  // delete cookie
  cookieStore.delete(authCookieSettings);

  // set logout cookie to show message
  cookieStore.set('logout', '1', { maxAge: 2, httpOnly: true, path: '/login', secure: true });

  // redirect user to login page
  return redirect('/login');
}
