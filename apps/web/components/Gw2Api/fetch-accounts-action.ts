'use server';
import 'server-only';
import { db } from '@/lib/prisma';
import { getUser } from '@/lib/getUser';
import { rest, refreshToken as getFreshToken } from '@gw2me/client';
import { UserProvider } from '@gw2treasures/database';
import { expiresAtFromExpiresIn } from '@/lib/expiresAtFromExpiresIn';

const client_id = process.env.GW2ME_CLIENT_ID!;
const client_secret = process.env.GW2ME_CLIENT_SECRET!;

export async function fetchAccounts() {
  const user = await getUser();

  if(!user) {
    console.error('Not logged in');
    return undefined;
  }

  const token = await db.userProvider.findFirst({
    where: { userId: user.id, provider: 'gw2.me' }
  });

  if(!token) {
    console.error('Not logged in');
    return undefined;
  }

  const access_token = await ensureActiveAccessToken(token);

  if(!access_token) {
    console.error('Unable to get access_token');
    return undefined;
  }

  const { accounts } = await rest.accounts({ access_token });

  return Promise.all(accounts.map(async ({ id: accountId, name }) => ({
    name,
    ...await rest.subtoken({ access_token, accountId }),
  })));
}

async function ensureActiveAccessToken({
  accessToken,
  accessTokenExpiresAt,
  refreshToken,
  refreshTokenExpiresAt,
  provider,
  providerAccountId
}: UserProvider) {
  const now = new Date();

  if(accessToken && (accessTokenExpiresAt === null || accessTokenExpiresAt > now)) {
    return accessToken;
  }

  if(refreshToken && (refreshTokenExpiresAt === null || refreshTokenExpiresAt > now)) {
    const fresh = await getFreshToken({ refresh_token: refreshToken, client_id, client_secret });

    await db.userProvider.update({
      where: { provider_providerAccountId: { provider, providerAccountId }},
      data: { accessToken: fresh.access_token, accessTokenExpiresAt: expiresAtFromExpiresIn(fresh.expires_in), refreshToken: fresh.refresh_token }
    });

    return fresh.access_token;
  }

  return undefined;
}
