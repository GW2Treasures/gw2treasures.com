import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';

const getUserData = cache(async () => {
  const session = await getUser();

  if(!session) {
    redirect('/login');
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: {
      sessions: { orderBy: { lastUsed: 'desc' }},
      providers: true
    },
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
      <FlexRow>
        <LinkButton external href="/logout">Logout</LinkButton>
        {user.roles.includes('Admin') && <LinkButton href="/admin/users">Admin</LinkButton>}
      </FlexRow>

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
              <td><FormatDate relative date={session.createdAt}/></td>
              <td><FormatDate relative date={session.lastUsed}/></td>
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
