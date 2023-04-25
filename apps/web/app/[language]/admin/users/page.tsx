import { Headline } from '@/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Table } from '@/components/Table/Table';
import { cache } from 'react';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';

const getUsers = cache(() => {
  return db.user.findMany();
});

export default async function AdminUserPage() {
  const users = await getUsers();

  return (
    <PageLayout>
      <Headline id="users">Users</Headline>

      <Table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(', ')}</td>
              <td><FormatDate date={user.createdAt} data-superjson/></td>
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
