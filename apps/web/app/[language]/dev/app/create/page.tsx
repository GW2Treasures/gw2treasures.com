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

async function createApplication(_: FormState, data: FormData): Promise<FormState> {
  'use server';

  const name = data.get('name');

  if(typeof name !== 'string' || name.length < 2) {
    return { error: 'Invalid name.' };
  }

  const user = await getUser();

  if(!user) {
    return { error: 'Not logged in.' };
  }

  const application = await db.application.create({
    data: {
      name,
      apiKey: crypto.randomUUID(),
      ownerId: user.id,
    }
  });

  redirect(`/dev/app/${application.id}`);
}

export default async function DevAppCreatePage() {
  const user = await getUser();

  return (
    <PageLayout>
      <Headline id="create">Create Application</Headline>
      {!user && (
        <Notice type="warning">You need to <Link href="/login">Login</Link> to create applications.</Notice>
      )}

      <p>
        You can create applications to access gw2treasures.com APIs.
      </p>

      {user && (
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

export const metadata = {
  title: 'Create Application'
};
