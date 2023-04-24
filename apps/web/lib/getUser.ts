import 'server-only';

import { headers } from 'next/headers';
import { db } from '@/lib/prisma';
import { cache } from 'react';
import { redirect } from 'next/navigation';

export const getUser = cache(async function getUser() {
  const sessionId = headers().get('x-gw2t-session');
  const session = await getSessionFromDb(sessionId);

  if(sessionId && !session) {
    redirect('/logout');
  }

  return session ? { ...session.user, sessionId: sessionId! } : undefined;
});

async function getSessionFromDb(sessionId: string | null) {
  if(!sessionId) {
    return undefined;
  }

  const update = await db.userSession.updateMany({
    where: { id: sessionId },
    data: { lastUsed: new Date() },
  });

  if(update.count === 1) {
    return db.userSession.findUnique({
      where: { id: sessionId },
      select: { user: { select: { id: true, name: true, roles: true }}}
    }) ?? undefined;
  }

  return undefined;
}
