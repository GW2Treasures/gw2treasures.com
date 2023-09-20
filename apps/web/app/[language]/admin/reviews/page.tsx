import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { cache } from 'react';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const getReviews = cache(() => {
  return db.review.findMany({
    include: {
      requester: { select: { name: true }},
      reviewer: { select: { name: true }},
    },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });
});

export default async function AdminUserPage() {
  const reviews = await getReviews();

  return (
    <PageLayout>
      <Headline id="reviews">Reviews ({reviews.length})</Headline>

      <Table>
        <thead>
          <tr>
            <th>Queue</th>
            <th>State</th>
            <th>Created by</th>
            <th>Created at</th>
            <th>Reviewed by</th>
            <th>Reviewed at</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td><Link href={`/review/container-content/${review.id}`}>{review.queue}</Link></td>
              <td>{review.state}</td>
              <td>{review.requester?.name}</td>
              <td><FormatDate date={review.createdAt}/></td>
              <td>{review.reviewer?.name}</td>
              <td><FormatDate date={review.reviewedAt}/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Reviews'
};
