import { Language } from '@gw2treasures/database';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import parseUserAgent from 'ua-parser-js';
import { getUrlFromParts, getUrlPartsFromRequest } from '@/lib/urlParts';
import { authCookie } from '@/lib/auth/cookie';
import { getAccessToken, rest } from '@gw2me/client';
import { expiresAtFromExpiresIn } from '@/lib/expiresAtFromExpiresIn';
import { getUser } from '@/lib/getUser';
import { cookies } from 'next/headers';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { isNotFoundError } from 'next/dist/client/components/not-found';

const client_id = process.env.GW2ME_CLIENT_ID;
const client_secret = process.env.GW2ME_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  if(!client_id || !client_secret) {
    console.error('GW2ME_CLIENT_ID or GW2ME_CLIENT_SECRET not set');
    redirect('/login?error');
  }

  try {
    // get code from querystring
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if(!code) {
      console.log('code missing');
      redirect('/login?error');
    }

    // build callback url
    const parts = getUrlPartsFromRequest(request);
    const redirect_uri = getUrlFromParts({
      ...parts,
      path: '/auth/callback'
    });

    const token = await getAccessToken({ client_id, client_secret, code, redirect_uri });
    const { user } = await rest.user({ access_token: token.access_token });

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
        user: { create: { name: user.name, email: user.email }}
      },
      update: {
        displayName: user.name,
        accessToken: token.access_token,
        accessTokenExpiresAt: expiresAtFromExpiresIn(token.expires_in),
        refreshToken: token.refresh_token,
        scope: token.scope.split(' '),
      }
    });

    // reuse existing session (when reauthorizing)
    const existingSession = await getUser();
    if(existingSession) {
      if(existingSession.id === userId) {
        // the existing session was for the same user and we can reuse it
        redirect('/profile');
      } else {
        // just logged in with a different user - lets delete the old session
        await db.userSession.delete({ where: { id: existingSession.sessionId }});
      }
    }

    // we couldn't reuse an existing session (doesn't exist or different user), so we have to create a new one...

    // parse user-agent to set session name
    const userAgentString = request.headers.get('user-agent');
    const userAgent = userAgentString ? parseUserAgent(userAgentString) : undefined;
    const sessionName = userAgent ? `${userAgent.browser.name} on ${userAgent.os.name}` : 'Session';

    // create a new session
    const session = await db.userSession.create({ data: { info: sessionName, userId }});

    // send response with session cookie
    cookies().set(authCookie(session.id, parts.protocol === 'https:'));
    redirect('/profile');
  } catch(error) {
    if(isRedirectError(error) || isNotFoundError(error)) {
      throw error;
    }

    console.error(error);
    redirect('/login?error');
  }
}

