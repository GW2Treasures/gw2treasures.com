import { headers } from 'next/headers';
import { db } from '@/lib/prisma';
import 'server-only';
import { cache } from 'react';

export const getUser = cache(async function getUser() {
  const sessionId = headers().get('x-gw2t-session');
  const session = sessionId ? await db.userSession.findUnique({ where: { id: sessionId }, select: { user: { select: { id: true, name: true }}}}) : undefined;

  if(sessionId && !session) {
    // TODO: handle invalid session
    console.warn('INVALID SESSION');
  }

  return session ? { ...session.user, sessionId: sessionId! } : undefined;
});
