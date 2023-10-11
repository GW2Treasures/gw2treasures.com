import { Button } from '@gw2treasures/ui/components/Form/Button';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';
import { Icon } from '@gw2treasures/ui';
import { Scope, getAuthorizationUrl } from '@gw2me/client';
import { getCurrentUrl } from '@/lib/url';

export default async function LoginPage({ searchParams }: { searchParams: { logout?: '', error?: '' }}) {
  const user = await getUser();

  if(user) {
    redirect('/profile');
  }

  return (
    <PageLayout>
      {searchParams.error !== undefined && (
        <Notice type="error">Unknown error</Notice>
      )}

      {searchParams.logout !== undefined && (
        <Notice>Logout successful</Notice>
      )}

      <form>
        <Button type="submit" formAction={redirectToGw2Me}><Icon icon="gw2me" color="#b7000d"/> Login with gw2.me</Button>
      </form>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Login'
};


const client_id = process.env.GW2ME_CLIENT_ID;

// eslint-disable-next-line require-await
async function redirectToGw2Me() {
  'use server';

  if(!client_id) {
    console.error('GW2ME_CLIENT_ID not set');
    redirect('/login?error');
  }

  // build redirect url
  const redirect_uri = new URL('/auth/callback', getCurrentUrl()).toString();

  // get gw2.me auth url
  const url = getAuthorizationUrl({ redirect_uri, client_id, scopes: [Scope.Identify, Scope.Email, Scope.GW2_Account, Scope.GW2_Progression] });

  // redirect to gw2.me
  redirect(url);
}
