import { FormatDate } from '@/components/Format/FormatDate';
import { ItemLink } from '@/components/Item/ItemLink';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { getUser } from '@/lib/getUser';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import type { EditContentOrder } from 'app/[language]/item/[id]/_edit-content/types';
import { notFound } from 'next/navigation';
import { approve, reject } from './actions';
import Link from 'next/link';
import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { CurrencyValue } from '@/components/Currency/CurrencyValue';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { localizedName } from '@/lib/localizedName';
import type { Language } from '@gw2treasures/database';
import { getLoginUrlWithReturnTo } from '@/lib/login-url';

const getReview = async function getReview(id: string) {
  const review = await db.review.findUnique({
    where: { id },
    include: {
      relatedItem: {
        select: {
          ...linkProperties,
          contains: { include: { contentItem: { select: linkProperties }}},
          containsCurrency: { include: { currency: { select: linkPropertiesWithoutRarity }}},
        }
      },
      reviewer: { select: { name: true }},
      requester: { select: { name: true }},
    }
  });

  if(!review || !review.relatedItem) {
    notFound();
  }

  return { review, item: review.relatedItem };
};

interface ReviewContainerContentPageProps {
  params: {
    id: string;
    language: Language;
  };
  searchParams: {
    error?: '';
  };
}

export default async function ReviewContainerContentPage({ params: { id }, searchParams }: ReviewContainerContentPageProps) {
  const { item, review } = await getReview(id);
  const { removedItems, addedItems, removedCurrencies = [], addedCurrencies = [] } = review.changes as unknown as EditContentOrder;

  const user = await getUser();

  const canReview = user && review.state === 'Open' && (review.requesterId !== user.id || user.roles.includes('Admin'));

  return (
    <HeroLayout hero={<Headline id="queue">Review Container Content</Headline>} color="#3f51b5">
      {searchParams.error !== undefined && (
        <Notice type="error" icon="review-queue">Your changes could not be saved.</Notice>
      )}

      {review.state !== 'Open' && (
        <Notice icon="review-queue">This change was already {review.state === 'Approved' ? 'approved' : 'rejected'} by <b>{review.reviewer?.name ?? 'Unknown User'}</b> on <FormatDate date={review.reviewedAt}/></Notice>
      )}
      {review.state === 'Open' && user && review.requesterId === user.id && (
        <Notice type="warning" icon="user">You can not review your own change request.</Notice>
      )}


      <p>Review requested by <b>{review.requester?.name || 'Unknown User'}</b> on <FormatDate date={review.createdAt}/></p>

      <Headline id="item">Item</Headline>
      <ItemLink item={item}/>

      {(removedItems.length !== 0 || addedItems.length !== 0) && (
        <>
          <Headline id="content">Content</Headline>
          <Table>
            <thead>
              <tr>
                <Table.HeaderCell small>Change</Table.HeaderCell>
                <Table.HeaderCell>Item</Table.HeaderCell>
                <Table.HeaderCell>Item Id</Table.HeaderCell>
                <Table.HeaderCell align="right">Quantity</Table.HeaderCell>
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
                    <td align="right"><FormatNumber value={content.quantity}/></td>
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
                    <td align="right"><FormatNumber value={added.quantity}/></td>
                    <td>{added.chance}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}

      {(removedCurrencies.length !== 0 || addedCurrencies.length !== 0) && (
        <>
          <Headline id="content">Currencies</Headline>
          <Table>
            <thead>
              <tr>
                <Table.HeaderCell small>Change</Table.HeaderCell>
                <Table.HeaderCell>Currency</Table.HeaderCell>
                <Table.HeaderCell align="right">Min</Table.HeaderCell>
                <Table.HeaderCell align="right">Max</Table.HeaderCell>
              </tr>
            </thead>
            <tbody>
              {item.containsCurrency.map((content) => {
                const isRemoved = removedCurrencies.includes(content.currencyId);
                return (
                  <tr key={content.currencyId} data-removed={isRemoved || undefined}>
                    <td>{isRemoved && 'Removed'}</td>
                    <td><CurrencyLink currency={content.currency}/></td>
                    <td align="right"><CurrencyValue currencyId={content.currencyId} value={content.min}/></td>
                    <td align="right"><CurrencyValue currencyId={content.currencyId} value={content.max}/></td>
                  </tr>
                );
              })}
              {addedCurrencies.map((added) => {
                return (
                  <tr key={added._id} data-added>
                    <td>Added</td>
                    <td><CurrencyLink currency={added.currency}/></td>
                    <td align="right"><CurrencyValue currencyId={added.currency.id} value={added.min}/></td>
                    <td align="right"><CurrencyValue currencyId={added.currency.id} value={added.max}/></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}

      <Headline id="actions">Actions</Headline>

      {!user && (
        <Notice>You need to <Link href={getLoginUrlWithReturnTo()}>Login</Link> to review this change.</Notice>
      )}

      <form>
        <input type="hidden" name="id" value={id}/>
        <FlexRow>
          <LinkButton external href={`/review/container-content?skip=${review.id}`} icon="chevron-right">Skip</LinkButton>
          <Separator/>
          <Button type="submit" disabled={!canReview} formAction={approve} icon="checkmark">Approve</Button>
          <Button type="submit" disabled={!canReview} formAction={reject} icon="cancel">Reject</Button>
        </FlexRow>
      </form>
    </HeroLayout>
  );
}


export async function generateMetadata({ params: { id, language }}: ReviewContainerContentPageProps) {
  const { item, review } = await getReview(id);

  return {
    title: `Review Container Content: ${localizedName(item, language)}`
  };
}
