import { redirect, unstable_rethrow as rethrow } from 'next/navigation';
import { NextRequest, userAgent } from 'next/server';
import { db } from '@/lib/prisma';
import { authCookie } from '@/lib/auth/cookie';
import { expiresAtFromExpiresIn } from '@/lib/expiresAtFromExpiresIn';
import { getUser } from '@/lib/getUser';
import { cookies } from 'next/headers';
import { gw2me } from '@/lib/gw2me';
import { getCurrentUrl } from '@/lib/url';
import { getReturnToUrlFromCookie } from '@/lib/login-url';

export async function GET(request: NextRequest) {
  try {
    // get code from querystring
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if(!code) {
      console.log('code missing');
      redirect('/login?error');
    }

    // build callback url
    const callbackUrl = new URL('/auth/callback', await getCurrentUrl());

    const token = await gw2me.getAccessToken({ code, redirect_uri: callbackUrl.toString() });
    const { user } = await gw2me.api(token.access_token).user();

    // build provider key
    const provider = { provider: 'gw2.me', providerAccountId: user.id };

    // try to find this account in db
    const { userId } = await db.userProvider.upsert({
      where: { provider_providerAccountId: provider },
      create: {
        ...provider,
        displayName: user.name,
        accessToken: token.access_token,
        accessTokenExpiresAt: expiresAtFromExpiresIn(token.expires_in),
        refreshToken: token.refresh_token,
        scope: token.scope.split(' '),
        user: { create: { name: user.name, email: user.email, emailVerified: user.emailVerified }}
      },
      update: {
        displayName: user.name,
        accessToken: token.access_token,
        accessTokenExpiresAt: expiresAtFromExpiresIn(token.expires_in),
        refreshToken: token.refresh_token,
        scope: token.scope.split(' '),
        user: { update: { name: user.name, email: user.email, emailVerified: user.emailVerified }}
      }
    });

    // reuse existing session (when reauthorizing)
    const currentUser = await getUser();
    if(currentUser) {
      if(currentUser.id === userId) {
        // the existing session was for the same user and we can reuse it
        redirect(await getReturnToUrlFromCookie());
      } else {
        // just logged in with a different user - lets delete the old session
        await db.userSession.delete({ where: { id: currentUser.session.id }});
      }
    }

    // we couldn't reuse an existing session (doesn't exist or different user), so we have to create a new one...

    // parse user-agent to set session name
    const ua = userAgent(request);
    const sessionName = ua ? `${ua.browser.name} on ${ua.os.name}` : 'Session';

    // create a new session
    const session = await db.userSession.create({ data: { info: sessionName, userId }});

    // send response with session cookie
    (await cookies()).set(authCookie(session.id, session.expiresAt!));
    redirect(await getReturnToUrlFromCookie());
  } catch(error) {
    rethrow(error);

    console.error(error);
    redirect('/login?error');
  }
}
