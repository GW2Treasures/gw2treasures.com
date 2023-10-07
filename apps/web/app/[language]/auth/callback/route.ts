import { Language } from '@gw2treasures/database';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import parseUserAgent from 'ua-parser-js';
import { getUrlFromParts, getUrlPartsFromRequest } from '@/lib/urlParts';
import { authCookie } from '@/lib/auth/cookie';
import { getAccessToken, rest } from '@gw2me/client';

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
        user: { create: { name: user.name, email: user.email }}
      },
      update: {
        displayName: user.name,
        accessToken: token.access_token,
        accessTokenExpiresAt: expiresAtFromExpiresIn(token.expires_in),
        refreshToken: token.refresh_token,
      }
    });

    // parse user-agent to set session name
    const userAgentString = request.headers.get('user-agent');
    const userAgent = userAgentString ? parseUserAgent(userAgentString) : undefined;
    const sessionName = userAgent ? `${userAgent.browser.name} on ${userAgent.os.name}` : 'Session';

    // create a new session
    const session = await db.userSession.create({ data: { info: sessionName, userId }});

    // send response with session cookie
    const profileUrl = getUrlFromParts({ ...parts, path: '/profile' });
    const response = NextResponse.redirect(profileUrl);
    response.cookies.set(authCookie(session.id, parts.protocol === 'https:'));
    return response;
  } catch(error) {
    console.error(error);
    redirect('/login?error');
  }
}

function expiresAtFromExpiresIn(expiresInSeconds: number) {
  const date = new Date();
  date.setSeconds(date.getSeconds() + expiresInSeconds);
  return date;
}
