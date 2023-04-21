import { getUrlPartsFromRequest } from '@/lib/getUrlPartsFromRequest';
import { Language } from '@gw2treasures/database';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

const clientId = process.env.DISCORD_CLIENT_ID!;

export function GET(request: NextRequest, { params: { language }}: { params: { language: Language }}) {
  const { domain, protocol, port } = getUrlPartsFromRequest(request);
  const callbackUrl = `${protocol}//${domain}:${port}/auth/callback/discord`;

  redirect(`https://discord.com/oauth2/authorize?client_id=${clientId}&scope=identify+email&redirect_uri=${callbackUrl.toString()}&response_type=code&prompt=none`);
}
