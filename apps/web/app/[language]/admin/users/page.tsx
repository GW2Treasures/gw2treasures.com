import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { cache } from 'react';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';

const getUsers = cache(() => {
  return db.user.findMany({
    orderBy: { createdAt: 'asc' },
    include: { sessions: { take: 1, orderBy: { lastUsed: 'desc' }, select: { lastUsed: true }}}
  });
});

export default async function AdminUserPage() {
  const users = await getUsers();

  return (
    <PageLayout>
      <Headline id="users">Users ({users.length})</Headline>

      <Table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Created At</th>
            <th>Last access</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(', ')}</td>
              <td><FormatDate date={user.createdAt}/></td>
              <td>{user.sessions.length > 0 ? <FormatDate date={user.sessions[0].lastUsed}/> : '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Users'
};
