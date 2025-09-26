'use server';

import { fetchAccessTokens, fetchAccounts } from '@/components/Gw2Api/fetch-accounts-action';
import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { absoluteUrl } from '@/lib/url';
import { fetchGw2Api } from '@gw2api/fetch';
import { Scope } from '@gw2me/client';
import type { AchievementProgressSnapshot } from './types';
import { SignJWT } from 'jose';
import { signingKey } from '@/components/ItemTable/signingKey';

export async function createAchievementSnapshotUrl(achievementId: number) {
  const user = await getUser();

  if(!user) {
    return { error: 'Not logged in' };
  }

  // fetch achievement
  const achievement = await db.achievement.findFirst({
    where: { id: achievementId },
  });

  if(!achievement) {
    return { error: 'Achievement not found' };
  }

  // load all accounts
  const accountRequest = await fetchAccounts([Scope.Accounts, Scope.GW2_Account, Scope.GW2_Progression]);

  if(accountRequest.error !== undefined) {
    return { error: 'Unable to load accounts' };
  }

  const accounts = accountRequest.accounts.filter((account) => !account.shared);

  const accessTokens = await fetchAccessTokens(accounts.map((account) => account.id));

  if(accessTokens.error !== undefined) {
    return { error: 'Unable to load accounts' };
  }

  // fetch achievement progress
  const snapshots = await Promise.all(accounts.map<Promise<AchievementProgressSnapshot>>(async (account) => {
    const allAchievementProgress = await fetchGw2Api('/v2/account/achievements', { accessToken: accessTokens.accessTokens[account.id].accessToken, schema: '2022-03-23T19:00:00.000Z' });
    const relevantAchievementProgress = allAchievementProgress.filter((achievementProgress) => achievementProgress.id === achievementId || achievement.prerequisitesIds.includes(achievementProgress.id));

    return [account.name, relevantAchievementProgress];
  }));

  // create JWT
  const key = await signingKey.getKey();
  const jwt = await new SignJWT({ snps: snapshots })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(`gw2t:a${achievementId}`)
    .sign(key);

  // create url
  const url = await absoluteUrl(`/achievement/${achievementId}`);
  url.searchParams.set('snapshot', jwt);

  return { url: url.toString() };
}
