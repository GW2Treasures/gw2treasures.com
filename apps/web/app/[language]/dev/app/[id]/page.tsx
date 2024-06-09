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
import { Form } from '@gw2treasures/ui/components/Form/Form';
import Link from 'next/link';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { deleteApplication, saveApplication, updateOrigins } from './actions';

async function getApplication(id: string) {
  const user = await getUser();

  if(!user) {
    redirect(getLoginUrlWithReturnTo());
  }

  const application = await db.application.findUnique({
    where: { id, ownerId: user.id }
  });

  if(!application) {
    notFound();
  }

  return application;
}

interface DevAppPageProps {
  params: {
    id: string;
  };
}

export default async function DevAppPage({ params: { id }}: DevAppPageProps) {
  const application = await getApplication(id);

  return (
    <PageLayout toc>
      <Headline id="application">{application.name}</Headline>

      <Form action={saveApplication.bind(null, application.id)}>
        <Label label="Name">
          <TextInput defaultValue={application.name} name="name"/>
        </Label>

        <FlexRow>
          <Button type="submit">Save</Button>
          <Button intent="delete" icon="delete" type="submit" formAction={deleteApplication.bind(null, application.id)}>
            Delete Application
          </Button>
        </FlexRow>
      </Form>

      <Headline id="api-key">API Key</Headline>
      <p>
        Use this API key to access the <Link href="/dev/api">gw2treasures.com API</Link>.
        It is okay to include this API key in native or mobile apps or client-side web applications.
      </p>

      <Label label="API Key">
        <TextInput value={application.apiKey} readOnly/>
        <CopyButton copy={application.apiKey} icon="copy">Copy</CopyButton>
      </Label>

      <Headline id="origins">Origins</Headline>
      <p>
        To access the gw2treasures.com API directly from a web browser, you&apos;ll need to register
        the <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin">origins</ExternalLink> your
        application uses. This is not required if you are making requests from a server-side environment
        without <ExternalLink href="https://developer.mozilla.org/en-US/docs/Glossary/CORS">CORS</ExternalLink> restrictions.
      </p>
      <Form action={updateOrigins.bind(null, application.id)}>
        <Table>
          <thead>
            <tr>
              <Table.HeaderCell>Origin</Table.HeaderCell>
              <Table.HeaderCell small>Actions</Table.HeaderCell>
            </tr>
          </thead>
          <tbody>
            {application.origins.map((origin) => (
              <tr key={origin}>
                <th>{origin}</th>
                <td><Button type="submit" name="delete" value={origin}>Delete</Button></td>
              </tr>
            ))}
            <tr>
              <td><FlexRow><TextInput name="origin"/></FlexRow></td>
              <td><Button type="submit" icon="add">Add Origin</Button></td>
            </tr>
          </tbody>
        </Table>
      </Form>
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
