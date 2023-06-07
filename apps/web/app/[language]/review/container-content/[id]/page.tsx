import { FormatDate } from '@/components/Format/FormatDate';
import { ItemLink } from '@/components/Item/ItemLink';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Notice } from '@/components/Notice/Notice';
import { getUser } from '@/lib/getUser';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { AddedItem } from 'app/[language]/item/[id]/_edit-content/types';
import { notFound, redirect } from 'next/navigation';
import { approve, reject } from './actions';

const getReview = async function getReview(id: string) {
  const review = await db.review.findUnique({
    where: { id },
    include: {
      relatedItem: { select: { ...linkProperties, contains: { include: { contentItem: { select: linkProperties }}}}},
      reviewer: { select: { name: true }},
      requester: { select: { name: true }},
    }
  });

  if(!review || !review.relatedItem) {
    notFound();
  }

  return { review, item: review.relatedItem };
};

export default async function ReviewContainerContentPage({ params: { id }}: { params: { id: string }}) {
  const { item, review } = await getReview(id);
  const { removedItems, addedItems } = review.changes as unknown as { removedItems: number[], addedItems: AddedItem[] };

  const user = await getUser();

  if(!user) {
    redirect('/login');
  }

  const canReview = review.state === 'Open' && (review.requesterId !== user.id || user.roles.includes('Admin'));

  return (
    <HeroLayout hero={<Headline id="queue">Review Container Content</Headline>} color="#3f51b5">
      {review.state !== 'Open' && (
        <Notice>This change was already {review.state === 'Approved' ? 'approved' : 'rejected'} by <b>{review.reviewer?.name ?? 'Unknown User'}</b> on <FormatDate date={review.reviewedAt}/></Notice>
      )}
      {review.state === 'Open' && review.requesterId === user.id && (
        <Notice type="warning" icon="user">You can not review your own change request.</Notice>
      )}


      <p>Review requested by <b>{review.requester?.name || 'Unknown User'}</b> on <FormatDate date={review.createdAt}/></p>

      <Headline id="item">Item</Headline>
      <ItemLink item={item}/>

      <Headline id="content">Content</Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small>Change</Table.HeaderCell>
            <Table.HeaderCell>Item</Table.HeaderCell>
            <Table.HeaderCell>Item Id</Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell>Chance</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {item.contains.map((content) => {
            const isRemoved = removedItems.includes(content.contentItemId);
            return (
              <tr key={content.contentItemId} data-removed={isRemoved || undefined}>
                <td>{isRemoved && 'Removed'}</td>
                <td><ItemLink item={content.contentItem}/></td>
                <td>{content.contentItemId}</td>
                <td>{content.quantity}</td>
                <td>{content.chance}</td>
              </tr>
            );
          })}
          {addedItems.map((added) => {
            return (
              <tr key={added._id} data-added>
                <td>Added</td>
                <td><ItemLink item={added.item}/></td>
                <td>{added.item.id}</td>
                <td>{added.quantity}</td>
                <td>{added.chance}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Headline id="actions">Actions</Headline>

      <form style={{ display: 'flex', gap: 16 }}>
        <input type="hidden" name="id" value={id}/>
        <LinkButton external href="/review/container-content">Skip</LinkButton>
        <Button type="submit" disabled={!canReview} formAction={approve}>Approve</Button>
        <Button type="submit" disabled={!canReview} formAction={reject}>Reject</Button>
      </form>
    </HeroLayout>
  );
}
