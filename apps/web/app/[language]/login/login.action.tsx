'use server';

import { expiresAtFromExpiresIn } from '@/lib/expiresAtFromExpiresIn';
import { gw2me } from '@/lib/gw2me';
import { isValidReturnToUrl } from '@/lib/login-url';
import { db } from '@/lib/prisma';
import { getCurrentUrl } from '@/lib/url';
import { Scope } from '@gw2me/client';
import { generatePKCEPair, type PKCEChallenge } from '@gw2me/client/pkce';
import { randomBytes } from 'crypto';
import { redirect } from 'next/navigation';
import 'server-only';

export async function redirectToGw2Me(returnTo?: string, additionalScopes?: string) {

  // build redirect url
  const redirect_uri = new URL('/auth/callback', await getCurrentUrl()).toString();

  // get scopes to request from gw2.me
  const scopes = getScopesFromString(additionalScopes);

  // prepare auth
  const auth = await prepareAuthRequest(returnTo);

  // get gw2.me auth url
  const url = gw2me.getAuthorizationUrl({
    scopes,
    redirect_uri,
    include_granted_scopes: true,
    state: auth.state,
    ...auth.pkce,
  });

  // redirect to gw2.me
  redirect(url);
}

interface AuthRequest {
  state: string,
  pkce: PKCEChallenge,
}

export async function prepareAuthRequest(returnTo?: string): Promise<AuthRequest> {
  const pkce = await generatePKCEPair();
  const state = await randomBytes(16).toString('base64url');

  // add expiration in 60 minutes
  const expiresAt = expiresAtFromExpiresIn(60 * 60);

  // store generated authorization request in db
  await db.authorizationRequest.create({
    data: {
      state,
      code_verifier: pkce.code_verifier,
      returnTo: isValidReturnToUrl(returnTo) ? returnTo : undefined,
      expiresAt,
    }
  });

  return {
    state,
    pkce: pkce.challenge,
  };
}


function getScopesFromString(scopeString?: string) {
  // valid scope values to validate the provided scopes against
  const validScopes: string[] = Object.values(Scope);

  // default scopes that are always requested
  const scopes = new Set([Scope.Identify]);

  // parse scopes
  const parsedScopes = scopeString?.split(' ') ?? [];

  // add all valid scopes to the scopes set
  for(const scope of parsedScopes) {
    if(validScopes.includes(scope)) {
      scopes.add(scope as Scope);
    }
  }

  // return the array of scopes to request
  return Array.from(scopes);
}
