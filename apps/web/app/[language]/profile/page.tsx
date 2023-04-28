import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@gw2treasures/ui';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Table } from '@/components/Table/Table';
import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const getUserData = cache(async () => {
  const session = await getUser();

  if(!session) {
    redirect('/login');
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: { sessions: true, providers: true },
  });

  if(!user) {
    redirect('/login');
  }

  return {
    sessionId: session.sessionId,
    user,
  };
});

export default async function ProfilePage() {
  const { sessionId, user } = await getUserData();

  return (
    <HeroLayout hero={<Headline id="profile">{user.name}</Headline>} toc>
      <LinkButton external href="/logout">Logout</LinkButton>

      <Headline id="providers">Login Providers</Headline>
      <Table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>User</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {user.providers.map((provider) => (
            <tr key={`${provider.provider}-${provider.providerAccountId}`}>
              <td>{provider.provider}</td>
              <td>{provider.displayName}</td>
              <td><FormatDate relative date={provider.createdAt} data-superjson/></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Headline id="sessions">Sessions</Headline>
      <Table>
        <thead>
          <tr>
            <th>Session</th>
            <th>Started</th>
            <th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          {user.sessions.map((session) => (
            <tr key={session.id}>
              <td>{session.info}{session.id === sessionId && ' (Current Session)'}</td>
              <td><FormatDate relative date={session.createdAt} data-superjson/></td>
              <td><FormatDate relative date={session.lastUsed} data-superjson/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </HeroLayout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { user } = await getUserData();

  return {
    title: user.name,
  };
};
