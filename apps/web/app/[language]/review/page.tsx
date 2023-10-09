import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import Link from 'next/link';
import { ReviewQueue } from '@gw2treasures/database';
import { FormatNumber } from '@/components/Format/FormatNumber';

const getQueues = async function getQueues() {
  const queues = await db.review.groupBy({
    by: ['queue'],
    where: { state: 'Open' },
    _count: true,
  });

  return queues.reduce<Partial<Record<ReviewQueue, number>>>((grouped, queue) => ({ ...grouped, [queue.queue]: queue._count }), {});
};

export default async function ReviewPage() {
  const queues = await getQueues();

  return (
    <HeroLayout hero={(<Headline id="queues">Review Queues</Headline>)} color="#3f51b5">
      <p>Help improve gw2treasures.com by reviewing suggested changes.</p>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Queue</Table.HeaderCell>
            <Table.HeaderCell>Size</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Link prefetch={false} href="/review/container-content">Container Content</Link></td>
            <td><FormatNumber value={queues.ContainerContent ?? 0}/></td>
          </tr>
        </tbody>
      </Table>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Review Queues',
};
