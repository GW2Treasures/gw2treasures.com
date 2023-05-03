import { getUrlFromParts, getUrlPartsFromRequest } from '@/lib/urlParts';
import { Scope, getAuthorizationUrl } from '@gw2me/api';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

const client_id = process.env.GW2ME_CLIENT_ID;

export function GET(request: NextRequest) {
  if(!client_id) {
    console.error('GW2ME_CLIENT_ID not set');
    redirect('/login?error');
  }

  // build redirect url
  const redirect_uri = getUrlFromParts({
    ...getUrlPartsFromRequest(request),
    path: '/auth/callback'
  });

  // get gw2.me auth url
  const url = getAuthorizationUrl({ redirect_uri, client_id, scopes: [Scope.Identify, Scope.Email] });

  // redirect to gw2.me
  redirect(url);
}
