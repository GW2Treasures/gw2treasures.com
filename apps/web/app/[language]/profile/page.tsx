import { LinkButton } from '@/components/Form/Button';
import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Table } from '@/components/Table/Table';
import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { redirect } from 'next/navigation';

async function getUserData() {
  const session = await getUser();

  if(!session) {
    return redirect('/login');
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: { sessions: true, providers: true },
  });

  return {
    sessionId: session.sessionId,
    user,
  };
}

export default async function ProfilePage() {
  const { sessionId, user } = await getUserData();

  return (
    <HeroLayout hero={<Headline id="profile">{user?.name}</Headline>} toc>
      <LinkButton external href="/logout">Logout</LinkButton>

      <Headline id="providers">Login Providers</Headline>
      <Table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {user?.providers.map((provider) => (
            <tr key={`${provider.provider}-${provider.providerAccountId}`}>
              <td>{provider.provider}</td>
              <td>{provider.displayName}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Headline id="sessions">Sessions</Headline>
      <Table>
        <thead>
          <tr>
            <th>Session</th>
            <th>Last used</th>
          </tr>
        </thead>
        <tbody>
          {user?.sessions.map((session) => (
            <tr key={session.id}>
              <td>{session.info}{session.id === sessionId && ' (Current Session)'}</td>
              <td><FormatDate relative date={session.lastUsed} data-superjson/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </HeroLayout>
  );
}
