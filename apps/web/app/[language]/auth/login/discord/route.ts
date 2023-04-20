import { Language } from '@gw2treasures/database';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

const clientId = process.env.DISCORD_CLIENT_ID!;

export function GET(request: NextRequest, { params: { language }}: { params: { language: Language }}) {
  const domain = request.headers.get('host')?.split(':')[0];
  const protocol = request.headers.get('X-Forwarded-Proto')?.concat(':') ?? request.nextUrl.protocol;
  const port = request.headers.get('X-Forwarded-Port') ?? request.nextUrl.port;

  const callbackUrl = `${protocol}//${domain}:${port}/auth/callback/discord`;

  redirect(`https://discord.com/oauth2/authorize?client_id=${clientId}&scope=identify+email&redirect_uri=${callbackUrl.toString()}&response_type=code&prompt=none`);
}
