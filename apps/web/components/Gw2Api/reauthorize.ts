'use server';
import { gw2me } from '@/lib/gw2me';
import { getCurrentUrl } from '@/lib/url';
import { Scope } from '@gw2me/client';
import { redirect } from 'next/navigation';
import 'server-only';

// eslint-disable-next-line require-await
export async function reauthorize() {
  // build redirect url
  const redirect_uri = new URL('/auth/callback', getCurrentUrl()).toString();

  // get gw2.me auth url
  const url = gw2me.getAuthorizationUrl({ redirect_uri, scopes: [Scope.Identify, Scope.Email, Scope.GW2_Account, Scope.GW2_Progression], prompt: 'consent' });

  // redirect to gw2.me
  redirect(url);
}
