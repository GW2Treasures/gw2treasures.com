'use server';
import { getCurrentUrl } from '@/lib/url';
import { Scope, getAuthorizationUrl } from '@gw2me/client';
import { redirect } from 'next/navigation';
import 'server-only';

const client_id = process.env.GW2ME_CLIENT_ID!;
const client_secret = process.env.GW2ME_CLIENT_SECRET!;

// eslint-disable-next-line require-await
export async function reauthorize() {
  if(!client_id) {
    console.error('GW2ME_CLIENT_ID not set');
    redirect('/login?error');
  }

  // build redirect url
  const redirect_uri = new URL('/auth/callback', getCurrentUrl()).toString();

  // get gw2.me auth url
  const url = getAuthorizationUrl({ redirect_uri, client_id, scopes: [Scope.Identify, Scope.Email, Scope.GW2_Account, Scope.GW2_Progression], prompt: 'consent' });

  // redirect to gw2.me
  redirect(url);
}
