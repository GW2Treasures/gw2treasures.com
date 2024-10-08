import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense, cache } from 'react';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Accounts } from './accounts';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { revalidatePath } from 'next/cache';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';

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
        <LinkButton external href="/logout" icon="logout">Logout</LinkButton>
        {user.roles.includes('Admin') && <LinkButton href="/admin/users">Admin</LinkButton>}
      </FlexRow>

      <Headline id="accounts">Accounts</Headline>
      <Suspense fallback={<Skeleton/>}>
        <Accounts/>
      </Suspense>

      <Headline id="sessions" actions={<form action={revokeAllSessions}><SubmitButton icon="delete">Revoke all</SubmitButton></form>}>Sessions</Headline>
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
}


async function revokeAllSessions() {
  'use server';

  const session = await getUser();

  if(!session) {
    return;
  }

  await db.userSession.deleteMany({
    where: { id: { not: session.sessionId }, userId: session.id }
  });

  revalidatePath('/profile');
}
