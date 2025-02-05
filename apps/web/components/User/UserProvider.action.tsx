'use server';

import { authCookie, expiresIn } from '@/lib/auth/cookie';
import { expiresAtFromExpiresIn } from '@/lib/expiresAtFromExpiresIn';
import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function extendUserSessionAction() {
  const user = await getUser();
  if(!user) {
    throw new Error('Can\'t extend non existing session');
  }

  console.log(`[UserProvider.action] Extending session ${user.session.id} for ${user.name} (${user.id})`);

  // calculate new expiresAt timestamp
  const newExpiresAt = expiresAtFromExpiresIn(expiresIn);

  // update expiresAt in db
  // TODO: start a new session instead?
  await db.userSession.update({
    where: { id: user.session.id },
    data: { expiresAt: newExpiresAt }
  });

  // extend cookie lifetime
  const cookieStore = await cookies();
  cookieStore.set(authCookie(user.session.id, newExpiresAt));
}
