import { FormatDate } from '@/components/Format/FormatDate';
import { ItemLink } from '@/components/Item/ItemLink';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { getUser } from '@/lib/getUser';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { notFound } from 'next/navigation';
import { submit } from './actions';
import Link from 'next/link';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { localizedName } from '@/lib/localizedName';
import type { Language } from '@gw2treasures/database';
import { Form } from '@gw2treasures/ui/components/Form/Form';
import type { SubmitEditMysticForgeOrder } from 'app/[language]/item/[id]/edit-mystic-forge/action';
import { OutputCountRange } from '@/components/Item/OutputCountRange';
import { OutputCount } from '@/components/Item/OutputCount';
import { Table } from '@gw2treasures/ui/components/Table/Table';

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

export default async function ReviewMysticForgePage({ params: { id }, searchParams }: ReviewContainerContentPageProps) {
  const { item, review } = await getReview(id);
  const { recipeId, outputCountMin, outputCountMax, ingredients } = review.changes as unknown as SubmitEditMysticForgeOrder;

  const ingredientItems = await db.item.findMany({
    where: { id: { in: ingredients.map(({ itemId }) => itemId) }},
    select: linkProperties
  });

  const recipe = recipeId
    ? await db.mysticForgeRecipe.findUnique({
        where: { id: recipeId },
        include: {
          outputItem: { select: linkProperties },
          itemIngredients: { include: { Item: { select: linkProperties }}}
        }
      })
    : undefined;

  const user = await getUser();

  const canReview = user && review.state === 'Open' && (review.requesterId !== user.id || user.roles.includes('Admin'));

  return (
    <HeroLayout hero={<Headline id="queue">Review Mystic Forge</Headline>} color="#3f51b5">
      {review.state !== 'Open' && (
        <Notice icon="review-queue">This change was already {review.state === 'Approved' ? 'approved' : 'rejected'} by <b>{review.reviewer?.name ?? 'Unknown User'}</b> on <FormatDate date={review.reviewedAt}/></Notice>
      )}
      {review.state === 'Open' && user && review.requesterId === user.id && (
        <Notice type="warning" icon="user">You can not review your own change request.</Notice>
      )}
      <Form action={submit.bind(null, id)}>
        <p>Review requested by <b>{review.requester?.name || 'Unknown User'}</b> on <FormatDate date={review.createdAt}/></p>

        <Headline id="item">Recipe</Headline>

        <Table>
          <thead>
            <tr>
              <Table.HeaderCell>Property</Table.HeaderCell>
              {recipe && (<Table.HeaderCell>Previous</Table.HeaderCell>)}
              <Table.HeaderCell>New</Table.HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: recipe && (recipe.outputCountMin !== outputCountMin || recipe.outputCountMax !== outputCountMax) ? '#ffc10722' : undefined }}>
              <th>Output</th>
              {recipe && (<td><OutputCountRange min={recipe.outputCountMin} max={recipe.outputCountMax}><ItemLink item={recipe.outputItem}/></OutputCountRange></td>)}
              <td><OutputCountRange min={outputCountMin} max={outputCountMax}><ItemLink item={item}/></OutputCountRange></td>
            </tr>
            {ingredients.map((ingredient, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={index} style={{ background: recipe && (recipe.itemIngredients[index].itemId !== ingredient.itemId || recipe.itemIngredients[index].count !== ingredient.count) ? '#ffc10722' : undefined }}>
                <th>Ingredient {index + 1}</th>
                {recipe && (<td><OutputCount count={recipe.itemIngredients[index].count}><ItemLink item={recipe.itemIngredients[index].Item}/></OutputCount></td>)}
                <th><OutputCount count={ingredient.count}><ItemLink item={ingredientItems.find(({ id }) => ingredient.itemId === id)!}/></OutputCount></th>
              </tr>
            ))}
          </tbody>
        </Table>

        <Headline id="actions">Actions</Headline>

        {!user && (
          <Notice>You need to <Link href="/login">Login</Link> to review this change.</Notice>
        )}

        <FlexRow>
          <LinkButton external href={`/review/mystic-forge?skip=${review.id}`} icon="chevron-right">Skip</LinkButton>
          <Separator/>
          <Button type="submit" disabled={!canReview} name="action" value="approve" icon="checkmark">Approve</Button>
          <Button type="submit" disabled={!canReview} name="action" value="reject" icon="cancel">Reject</Button>
        </FlexRow>
      </Form>
    </HeroLayout>
  );
}


export async function generateMetadata({ params: { id, language }}: ReviewContainerContentPageProps) {
  const { item, review } = await getReview(id);

  return {
    title: `Review Mystic Forge Recipe: ${localizedName(item, language)}`
  };
}
