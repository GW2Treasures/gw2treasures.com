import { extraColumn } from '@/components/ItemTable/columns';
import { ItemTable } from '@/components/ItemTable/ItemTable';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { PageLayout } from '@/components/Layout/PageLayout';
import { db } from '@/lib/prisma';
import { UnlocksRecipeIdColumn, ItemIdColumn } from './page.client';
import type { TODO } from '@/lib/todo';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Textarea } from '@gw2treasures/ui/components/Form/Textarea';

export default async function LyePage() {
  const knownRecipeIds = (await db.recipe.findMany({ select: { id: true }})).map(({ id }) => id);
  const recipes = await db.$queryRaw<{ id: number, unlocksRecipeIds: number[] }[]>`SELECT id, "unlocksRecipeIds" FROM "Item" WHERE NOT ("unlocksRecipeIds" <@ ${knownRecipeIds}::integer[]);`;

  const missingIds = recipes.flatMap(({ unlocksRecipeIds }) => unlocksRecipeIds.filter((id) => !knownRecipeIds.includes(id)));

  return (
    <PageLayout>
      <ItemTableContext id="missingRecipes">
        <Headline id="missing-recipes">Missing Recipes</Headline>
        <p>These recipe ids are unlocked by an item, but are not whitelisted in /v2/recipes.</p>
        <Textarea defaultValue={JSON.stringify(missingIds)} readOnly/>
        <ItemTable
          query={{ where: { id: { in: recipes.map(({ id }) => id) }}}}
          extraColumns={[
            extraColumn<'item'>({ id: 'missing', select: { unlocksRecipeIds: true }, title: 'Missing Recipe IDs', component: UnlocksRecipeIdColumn as TODO, componentProps: { missingIds }}),
            extraColumn<'item'>({ id: 'id', select: { id: true }, title: 'Item ID', component: ItemIdColumn as TODO })
          ]}
          defaultColumns={['missing', 'id', 'item', 'createdAt']}/>
      </ItemTableContext>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Lye',
  description: 'Ids in the GW2 API that needs whitelisting.'
};
