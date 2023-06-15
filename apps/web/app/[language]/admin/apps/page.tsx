import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { cache } from 'react';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';
import { Code } from '@/components/Layout/Code';

const getApplications = cache(() => {
  return db.application.findMany({
    include: { owner: { select: { name: true }}}
  });
});

export default async function AdminUserPage() {
  const apps = await getApplications();

  return (
    <PageLayout>
      <Headline id="apps">Applications ({apps.length})</Headline>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>API key</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id}>
              <td>{app.name}</td>
              <td>{app.owner.name}</td>
              <td><Code inline>{app.apiKey}</Code></td>
              <td><FormatDate date={app.createdAt}/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Applications'
};
