import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { Label } from '@gw2treasures/ui/components/Form/Label';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { db } from '@/lib/prisma';
import type { Prisma } from '@gw2treasures/database';
import { getUser } from '@/lib/getUser';
import { Form, type FormState } from '@gw2treasures/ui/components/Form/Form';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { ensureUserIsAdmin } from '../admin';

export default async function AdminQueueJobPage() {
  await ensureUserIsAdmin();

  return (
    <PageLayout>
      <Headline id="apps">Queue Job</Headline>
      <Form action={submit}>
        <Label label="Type"><TextInput name="type"/></Label>

        <Label label="Data"><TextInput name="data" defaultValue="{}"/></Label>

        <FlexRow>
          <SubmitButton>Queue</SubmitButton>
        </FlexRow>
      </Form>
    </PageLayout>
  );
}

async function submit(_: FormState, payload: FormData): Promise<FormState> {
  'use server';

  const user = await getUser();
  if(!user || !user.roles.includes('Admin')) {
    return { error: 'Not authorized' };
  }

  const type = payload.get('type');
  const rawData = payload.get('data');

  if(typeof type !== 'string') {
    return { error: 'Invalid type' };
  }
  if(typeof rawData !== 'string') {
    return { error: 'Invalid data' };
  }

  let data: Prisma.JsonObject;

  try {
    data = JSON.parse(rawData);
  } catch {
    return { error: 'Invalid data' };
  }

  await db.job.create({
    data: {
      type,
      data,
    }
  });

  return { success: 'Queued' };
}

export const metadata = {
  title: 'Jobs'
};
