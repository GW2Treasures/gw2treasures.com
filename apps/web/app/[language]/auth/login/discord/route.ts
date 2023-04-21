import { getUrlPartsFromRequest } from '@/lib/getUrlPartsFromRequest';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

const clientId = process.env.DISCORD_CLIENT_ID;

export function GET(request: NextRequest) {
  const { domain, protocol, port } = getUrlPartsFromRequest(request);
  const callbackUrl = `${protocol}//${domain}:${port}/auth/callback/discord`;

  if(!clientId) {
    redirect('/login?error');
  }

  redirect(`https://discord.com/oauth2/authorize?client_id=${clientId}&scope=identify+email&redirect_uri=${callbackUrl.toString()}&response_type=code&prompt=none`);
}
