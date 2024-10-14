import { PageLayout } from '@/components/Layout/PageLayout';
import { EditMysticForge } from './EditMysticForge';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { PageProps } from '@/lib/next';

export type EditMysticForgePageProps = PageProps<{ id: string }>;

export default async function EditMysticForgePage({ params, searchParams }: EditMysticForgePageProps) {
  const { id } = await params;
  const outputItemId = Number(id);

  return (
    <PageLayout>
      <Headline id="mf">{searchParams.recipe ? 'Edit Mystic Forge Recipe' : 'Add Mystic Forge Recipe'}</Headline>
      <EditMysticForge outputItemId={outputItemId} recipeId={Array.isArray(searchParams.recipe) ? searchParams.recipe[0] : searchParams.recipe}/>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Edit Mystic Forge'
};
