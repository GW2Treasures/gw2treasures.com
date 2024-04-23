import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { PageLayout } from '@/components/Layout/PageLayout';
import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { Label } from '@gw2treasures/ui/components/Form/Label';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { notFound, redirect } from 'next/navigation';
import { getLoginUrlWithReturnTo } from '@/lib/login-url';

async function getApplication(id: string) {
  const user = await getUser();

  if(!user) {
    redirect(getLoginUrlWithReturnTo());
  }

  const application = await db.application.findUnique({ where: { id }});

  if(!application || application.ownerId !== user.id) {
    notFound();
  }

  return application;
}

async function deleteApplication(data: FormData) {
  'use server';

  const id = data.get('id')?.toString();
  const user = await getUser();

  if(!user) {
    redirect(getLoginUrlWithReturnTo());
  }

  await db.application.deleteMany({ where: { id, ownerId: user.id }});

  redirect('/dev#applications');
}

interface DevAppPageProps {
  params: {
    id: string;
  };
}

export default async function DevAppPage({ params: { id }}: DevAppPageProps) {
  const application = await getApplication(id);

  return (
    <PageLayout>
      <Headline id="application">{application.name}</Headline>

      <form>
        <input type="hidden" name="id" value={application.id}/>

        <Label label="API Key">
          <TextInput value={application.apiKey} readOnly/>
          <CopyButton copy={application.apiKey} icon="copy">Copy</CopyButton>
        </Label>

        <FlexRow>
          <Button intent="delete" icon="delete" type="submit" formAction={deleteApplication}>Delete Application</Button>
        </FlexRow>
      </form>
    </PageLayout>
  );
}


export async function generateMetadata({ params: { id }}: DevAppPageProps) {
  const application = getApplication(id);

  if(!application) {
    return notFound();
  }

  return {
    title: `Application: ${(await application).name}`
  };
}
