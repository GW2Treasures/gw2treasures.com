import { Language } from '@gw2treasures/database';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import parseUserAgent from 'ua-parser-js';
import { getUrlPartsFromRequest } from '@/lib/getUrlPartsFromRequest';

const baseDomain = process.env.GW2T_NEXT_DOMAIN;
const clientId = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  if(!clientId || !clientSecret) {
    console.error('DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET not set');
    redirect('/login?error');
  }

  try {
    // get code from querystring
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if(!code) {
      redirect('/login?error');
    }

    // build callback url
    const { domain, protocol, port } = getUrlPartsFromRequest(request);
    const callbackUrl = `${protocol}//${domain}:${port}/auth/callback/discord`;

    // build token request
    const data = new URLSearchParams({
      // eslint-disable-next-line object-shorthand
      'code': code,
      'client_id': clientId,
      'client_secret': clientSecret,
      'grant_type': 'authorization_code',
      'redirect_uri': callbackUrl,
    });

    // get discord token
    const token = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data,
    }).then(getJsonIfOk) as { access_token: string };

    // get profile info with token
    const profile = await fetch('https://discord.com/api/users/@me', {
      headers: { 'Authorization': `Bearer ${token.access_token}` }
    }).then(getJsonIfOk) as { id: string, username: string, email: string, discriminator: string };

    // build provider key
    const provider = { provider: 'discord', providerAccountId: profile.id };

    // try to find this account in db
    const userProvider = await db.userProvider.findUnique({ where: { provider_providerAccountId: provider }});
    let userId = userProvider?.userId;

    // if user doesn't exist yet create in db
    if(!userId) {
      const user = await db.user.create({
        data: {
          name: profile.username,
          email: profile.email,

          providers: {
            create: {
              ...provider,
              displayName: `${profile.username}#${profile.discriminator}`,
              token,
            }
          },
        }
      });

      userId = user.id;
    }

    // parse user-agent to set session name
    const userAgentString = request.headers.get('user-agent');
    const userAgent = userAgentString ? parseUserAgent(userAgentString) : undefined;
    const sessionName = userAgent ? `${userAgent.browser.name} on ${userAgent.os.name}` : 'Session';

    // create a new session
    const session = await db.userSession.create({ data: { info: sessionName, userId }});

    // send response with session cookie
    const response = NextResponse.redirect(`${protocol}//${domain}:${port}/profile`);
    response.cookies.set('gw2t-session', session.id, { domain: baseDomain, sameSite: 'lax', httpOnly: true, secure: protocol === 'https' });
    return response;
  } catch(error) {
    console.error(error);
    redirect('/login?error');
  }
}

function getJsonIfOk(response: Response) {
  if(!response.ok) {
    throw new Error('Could not load discord profile');
  }

  return response.json();
}
