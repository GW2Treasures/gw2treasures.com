import { PageLayout } from '@/components/Layout/PageLayout';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { Label } from '@gw2treasures/ui/components/Form/Label';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { db } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/getUser';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import Link from 'next/link';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Form, type FormState } from '@gw2treasures/ui/components/Form/Form';
import { getLoginUrlWithReturnTo } from '@/lib/login-url';
import { cache } from 'react';
import { reauthorize } from '@/components/Gw2Api/reauthorize';
import { Scope } from '@gw2me/client';
import { createMetadata } from '@/lib/metadata';

async function createApplication(_: FormState, data: FormData): Promise<FormState> {
  'use server';

  const name = data.get('name');

  if(typeof name !== 'string' || name.trim().length < 2) {
    return { error: 'Invalid name.' };
  }

  const { user, email } = await getUserAndEmail();

  if(!user) {
    return { error: 'Not logged in.' };
  }

  if(!email?.email || !email.emailVerified) {
    return { error: 'Verified email required.' };
  }

  const application = await db.application.create({
    data: {
      name: name.trim(),
      apiKey: crypto.randomUUID(),
      ownerId: user.id,
    }
  });

  redirect(`/dev/app/${application.id}`);
}

const getUserAndEmail = cache(async function getUserAndEmail() {
  const user = await getUser();
  const email = user ? await db.user.findUnique({ where: { id: user.id }, select: { email: true, emailVerified: true }}) : undefined;

  return { user, email };
});

export default async function DevAppCreatePage() {
  const { user, email } = await getUserAndEmail();

  return (
    <PageLayout>
      <Headline id="create">Create Application</Headline>
      {!user && (
        <Notice type="warning">You need to <Link href={await getLoginUrlWithReturnTo([Scope.Email])}>Login</Link> to create applications.</Notice>
      )}
      {user && !email?.emailVerified && (
        <form action={reauthorize.bind(null, [Scope.Email], 'consent')}>
          <Notice type="warning">You need to add a verified email address on gw2.me and authorize gw2treasures.com in order to create applications. <SubmitButton icon="gw2me-outline">Authorize</SubmitButton></Notice>
        </form>
      )}

      <p>
        You can create applications to access gw2treasures.com APIs.
      </p>

      {user && email?.emailVerified && (
        <Form action={createApplication}>
          <Label label="Name">
            <TextInput name="name"/>
          </Label>

          <FlexRow>
            <SubmitButton type="submit" icon="add">Create Application</SubmitButton>
          </FlexRow>
        </Form>
      )}
    </PageLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Create Application'
});
