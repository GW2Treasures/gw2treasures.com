import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { cache } from 'react';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';
import { Code } from '@/components/Layout/Code';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { ensureUserIsAdmin } from '../admin';
import { List } from '@gw2treasures/ui/components/Layout/List';

const getApplications = cache(() => {
  const lastDay = new Date();
  lastDay.setHours(lastDay.getHours() - 24);

  return db.application.findMany({
    include: {
      owner: { select: { name: true }},
      _count: { select: { requests: { where: { time: { gte: lastDay }}}}}
    },
    orderBy: { createdAt: 'asc' }
  });
});

export default async function AdminUserPage() {
  await ensureUserIsAdmin();
  const apps = await getApplications();
  const Apps = createDataTable(apps, ({ id }) => id);

  return (
    <PageLayout>
      <Headline id="apps" actions={<ColumnSelect table={Apps}/>}>Applications ({apps.length})</Headline>

      <Apps.Table>
        <Apps.Column id="name" title="Name" sortBy="name">
          {({ name }) => name}
        </Apps.Column>
        <Apps.Column id="owner" title="Owner" sortBy={({ owner }) => owner.name}>
          {({ owner }) => owner.name}
        </Apps.Column>
        <Apps.Column id="apiKey" title="API key">
          {({ apiKey }) => <Code inline>{apiKey}</Code>}
        </Apps.Column>
        <Apps.Column id="origins" title="Origins" sortBy={({ origins }) => origins.length} hidden>
          {({ origins }) => <List>{origins.map((origin) => <li key={origin}>{origin}</li>)}</List>}
        </Apps.Column>
        <Apps.Column id="requests" align="right" title="Requests (24h)" sortBy={({ _count }) => _count.requests}>
          {({ _count }) => <FormatNumber value={_count.requests}/>}
        </Apps.Column>
        <Apps.Column id="createdAt" align="right" title="Created At" sortBy="createdAt">
          {({ createdAt }) => <FormatDate date={createdAt}/>}
        </Apps.Column>
      </Apps.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Applications'
};
