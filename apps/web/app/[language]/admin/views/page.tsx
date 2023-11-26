import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { cache } from 'react';
import { db } from '@/lib/prisma';
import { DataList } from '@/components/Infobox/DataList';

const getViews = cache(async function getViews() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [views, mostViewed] = await Promise.all([
    db.pageViewHistory.groupBy({
      by: 'date',
      _sum: { count: true },
      where: { date: { gte: sevenDaysAgo }},
      orderBy: { date: 'desc' },
    }),
    db.pageViewHistory.groupBy({
      by: ['page', 'pageId'],
      _sum: { count: true },
      where: { date: { gte: sevenDaysAgo }},
      orderBy: { _sum: { count: 'desc' }},
      take: 25,
    })
  ]);

  return { views, mostViewed };
});

export default async function AdminUserPage() {
  const { views, mostViewed } = await getViews();
  const totalViews = views.reduce((total, views) => total + (views._sum.count ?? 0), 0);

  return (
    <PageLayout>
      <Headline id="reviews">Page Views (last 7 days)</Headline>

      <DataList data={[{ key: 'total', label: 'Total', value: totalViews },
        ...views.map(({ date, _sum }) => ({
          key: date.toISOString(),
          label: `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`,
          value: _sum.count
        }))
      ]}/>

      <Headline id="most-viewed">Most Viewed</Headline>

      <Table>
        <thead>
          <tr>
            <th>Page</th>
            <th>ID</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {mostViewed.map((view) => (
            <tr key={`${view.page}-${view.pageId}`}>
              <td>{view.page}</td>
              <td>{view.pageId}</td>
              <td>{view._sum.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Page Views'
};
