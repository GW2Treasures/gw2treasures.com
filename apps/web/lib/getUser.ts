import 'server-only';

import { cookies, headers } from 'next/headers';
import { db } from '@/lib/prisma';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { UserRole } from '@gw2treasures/database';
import { authCookieSettings } from './auth/cookie';

export interface SessionUser {
  id: string;
  name: string;
  roles: UserRole[];
  session: {
    id: string,
    expiresAt?: Date,
  }
}

export const getUser = cache(async function getUser(): Promise<SessionUser | undefined> {
  const sessionId = (await headers()).get('x-gw2t-session');
  const session = await getSessionFromDb(sessionId);

  // if a session id is set but the session was not found in the db,
  // delete the cookie and redirect to login page
  if(sessionId && !session) {
    (await cookies()).delete(authCookieSettings);
    redirect('/login');
  }

  return session
    ? { ...session.user, session: { id: sessionId!, expiresAt: session.expiresAt ?? undefined }}
    : undefined;
});

async function getSessionFromDb(sessionId: string | null) {
  if(!sessionId) {
    return undefined;
  }

  // get the current date
  const now = new Date();

  // find matching session that is not expired,
  // update lastUsedAt timestamp,
  // and return with user data
  const [session] = await db.userSession.updateManyAndReturn({
    where: { id: sessionId, OR: [{ expiresAt: { gte: now }}, { expiresAt: null }] },
    data: { lastUsedAt: now },
    select: { expiresAt: true, user: { select: { id: true, name: true, roles: true }}},
  });

  return session;
}
