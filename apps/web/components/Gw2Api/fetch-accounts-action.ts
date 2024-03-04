'use server';
import 'server-only';
import { db } from '@/lib/prisma';
import { getUser } from '@/lib/getUser';
import { Scope } from '@gw2me/client';
import type { UserProvider } from '@gw2treasures/database';
import { expiresAtFromExpiresIn } from '@/lib/expiresAtFromExpiresIn';
import { type FetchAccountResponse, ErrorCode, type FetchAccessTokenResponse } from './types';
import { gw2me } from '@/lib/gw2me';
import { isDefined } from '@gw2treasures/helper/is';

export async function fetchAccounts(): Promise<FetchAccountResponse> {
  const user = await getUser();

  if(!user) {
    return { error: ErrorCode.NOT_LOGGED_IN };
  }

  const token = await db.userProvider.findFirst({
    where: { userId: user.id, provider: 'gw2.me' }
  });

  if(!token) {
    return { error: ErrorCode.NOT_LOGGED_IN };
  }

  const requiredScopes = [Scope.GW2_Account, Scope.GW2_Progression];
  if(requiredScopes.some((scope) => !token.scope.includes(scope))) {
    return { error: ErrorCode.MISSING_PERMISSION };
  }

  const access_token = await ensureActiveAccessToken(token);

  if(!access_token) {
    console.error('Unable to get access_token');
    return { error: ErrorCode.REAUTHORIZE };
  }

  let response;
  try {
    response = await gw2me.api(access_token).accounts();
  } catch(e) {
    return { error: ErrorCode.REAUTHORIZE };
  }

  return {
    error: undefined,
    accounts: response.accounts,
    scopes: token.scope as Scope[]
  };
}

export async function fetchAccessTokens(accountIds: string[]): Promise<FetchAccessTokenResponse> {
  console.log('fetch access tokens', accountIds);

  const user = await getUser();

  if(!user) {
    return { error: ErrorCode.NOT_LOGGED_IN };
  }

  const token = await db.userProvider.findFirst({
    where: { userId: user.id, provider: 'gw2.me' }
  });

  if(!token) {
    return { error: ErrorCode.NOT_LOGGED_IN };
  }

  const gw2meToken = await ensureActiveAccessToken(token);

  if(!gw2meToken) {
    console.error('Unable to get access_token');
    return { error: ErrorCode.REAUTHORIZE };
  }

  const api = gw2me.api(gw2meToken);

  const subtokens = await Promise.all(accountIds.map(
    (accountId) => api.subtoken(accountId)
      .then(({ subtoken, expiresAt }) => [accountId, { accessToken: subtoken, expiresAt: new Date(expiresAt) }] as const)
      .catch(() => undefined)
  ));

  const responseAsObject = Object.fromEntries(subtokens.filter(isDefined));

  return {
    error: undefined,
    accessTokens: responseAsObject,
  };
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
    const fresh = await gw2me.refreshToken({ refresh_token: refreshToken });

    await db.userProvider.update({
      where: { provider_providerAccountId: { provider, providerAccountId }},
      data: { accessToken: fresh.access_token, accessTokenExpiresAt: expiresAtFromExpiresIn(fresh.expires_in), refreshToken: fresh.refresh_token }
    });

    return fresh.access_token;
  }

  return undefined;
}
