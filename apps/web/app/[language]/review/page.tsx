import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import Link from 'next/link';
import { ReviewQueue } from '@gw2treasures/database';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Trans } from '@/components/I18n/Trans';
import { createMetadata } from '@/lib/metadata';

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
    <HeroLayout hero={(<Headline id="queues"><Trans id="review"/></Headline>)} color="#3f51b5">
      <p><Trans id="review.description"/></p>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Queue</Table.HeaderCell>
            <Table.HeaderCell>Open Reviews</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Link prefetch={false} href="/review/container-content"><Trans id="review.queue.ContainerContent"/></Link></td>
            <td><FormatNumber value={queues.ContainerContent ?? 0}/></td>
          </tr>
          <tr>
            <td><Link prefetch={false} href="/review/mystic-forge"><Trans id="review.queue.MysticForge"/></Link></td>
            <td><FormatNumber value={queues.MysticForge ?? 0}/></td>
          </tr>
        </tbody>
      </Table>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Review Queues',
});
