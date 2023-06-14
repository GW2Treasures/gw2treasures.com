import { HeroLayout } from '@/components/Layout/HeroLayout';
import { getUser } from '@/lib/getUser';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import Link from 'next/link';
import { db } from '@/lib/prisma';

async function getApplications() {
  const user = await getUser();

  const applications = user
    ? await db.application.findMany({ where: { ownerId: user.id }})
    : [];

  return { user, applications };
}

export default async function DeveloperPage() {
  const { user, applications } = await getApplications();

  return (
    <HeroLayout hero={<Headline id="developer">Developer</Headline>} color="#2c8566" toc>
      <Headline id="services">Services</Headline>
      <ul>
        <li><b><Link href="/dev/icons">Icons</Link></b>: Alternative to render.guildwars2.com with more features.</li>
      </ul>

      <Headline id="api">API</Headline>

      <ul>
        <li>coming soon&trade;</li>
      </ul>

      {user && (
        <>
          <Headline
            id="applications"
            actions={<LinkButton icon="add" href="/dev/app/create">Create Application</LinkButton>}
          >
            Your applications
          </Headline>

          <ul>
            {applications.map(({ id, name }) => (
              <li key={id}><Link href={`/dev/app/${id}`}>{name}</Link></li>
            ))}
          </ul>
        </>
      )}
    </HeroLayout>
  );
}
