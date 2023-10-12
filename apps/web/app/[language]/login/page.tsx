import { Button } from '@gw2treasures/ui/components/Form/Button';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';
import { Icon } from '@gw2treasures/ui';
import { Scope } from '@gw2me/client';
import { gw2me } from '@/lib/gw2me';
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

// eslint-disable-next-line require-await
async function redirectToGw2Me() {
  'use server';

  // build redirect url
  const redirect_uri = new URL('/auth/callback', getCurrentUrl()).toString();

  // get gw2.me auth url
  const url = gw2me.getAuthorizationUrl({ redirect_uri, scopes: [Scope.Identify, Scope.Email], include_granted_scopes: true });

  // redirect to gw2.me
  redirect(url);
}
