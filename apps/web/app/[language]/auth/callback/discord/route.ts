import { Language } from '@gw2treasures/database';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

const baseDomain = process.env.GW2T_NEXT_DOMAIN!;
const clientId = process.env.DISCORD_CLIENT_ID!;
const clientSecret = process.env.DISCORD_CLIENT_SECRET!;

export async function GET(request: NextRequest, { params: { language }}: { params: { language: Language }}) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if(!code) {
      redirect('/login?error');
    }

    const domain = request.headers.get('host')?.split(':')[0];
    const protocol = request.headers.get('X-Forwarded-Proto')?.concat(':') ?? request.nextUrl.protocol;
    const port = request.headers.get('X-Forwarded-Port') ?? request.nextUrl.port;

    const callbackUrl = `${protocol}//${domain}:${port}/auth/callback/discord`;

    const data = new URLSearchParams();
    data.append('client_id', clientId);
    data.append('client_secret', clientSecret);
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', callbackUrl);

    const token = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data,
    }).then((r) => r.json()) as { access_token: string };

    const profile = await fetch('https://discord.com/api/users/@me', {
      headers: { 'Authorization': `Bearer ${token.access_token}` }
    }).then((r) => r.json()) as { id: string, username: string, email: string, discriminator: string };

    const providerKey = { provider: 'discord', providerAccountId: profile.id };

    const userProvider = await db.userProvider.findUnique({ where: { provider_providerAccountId: providerKey }});

    let userId = userProvider?.userId;

    if(!userId) {
      // create user in db
      const user = await db.user.create({ data: { name: profile.username, providers: { create: { ...providerKey, displayName: `${profile.username}#${profile.discriminator}` }}}});
      userId = user.id;
    }

    const session = await db.userSession.create({ data: { info: 'Session', userId }});

    const response = NextResponse.redirect(`${protocol}//${domain}:${port}/profile`);
    response.cookies.set('gw2t-session', session.id, { domain: baseDomain, sameSite: 'lax', httpOnly: true, secure: protocol === 'https' });
    return response;
  } catch(error) {
    console.error(error);
    redirect('/login?error');
  }
}
