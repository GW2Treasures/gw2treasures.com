import { getUrlPartsFromRequest } from '@/lib/getUrlPartsFromRequest';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

const clientId = process.env.DISCORD_CLIENT_ID;

export function GET(request: NextRequest) {
  if(!clientId) {
    console.error('DISCORD_CLIENT_ID not set');
    redirect('/login?error');
  }

  // build callback url
  const { domain, protocol, port } = getUrlPartsFromRequest(request);
  const callbackUrl = `${protocol}//${domain}:${port}/auth/callback/discord`;

  // build discord url
  const searchParams = new URLSearchParams({
    'client_id': clientId,
    'scope': 'identify email',
    'redirect_uri': callbackUrl,
    'response_type': 'code',
    'prompt': 'none'
  });

  // redirect to discord
  redirect(`https://discord.com/oauth2/authorize?${searchParams.toString()}`);
}
