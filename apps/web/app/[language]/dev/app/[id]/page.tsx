import { PageLayout } from '@/components/Layout/PageLayout';
import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { Label } from '@gw2treasures/ui/components/Form/Label';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { notFound, redirect } from 'next/navigation';

async function getApplication(id: string) {
  const user = await getUser();

  if(!user) {
    redirect('/login');
  }

  const application = await db.application.findUnique({ where: { id }});

  if(!application || application.ownerId !== user.id) {
    notFound();
  }

  return application;
}

export default async function DevAppPage({ params: { id }}: { params: { id: string }}) {
  const application = await getApplication(id);

  return (
    <PageLayout>
      <Headline id="application">{application.name}</Headline>

      <Label label="API Key">
        <div style={{ display: 'flex', gap: 8 }}>
          <TextInput value={application.apiKey} readOnly/>
          <CopyButton copy={application.apiKey}>Copy</CopyButton>
        </div>
      </Label>
    </PageLayout>
  );
}
