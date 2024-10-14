import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Modal } from './modal';
import { EditMysticForge } from 'app/[language]/item/[id]/edit-mystic-forge/EditMysticForge';
import type { EditMysticForgePageProps } from 'app/[language]/item/[id]/edit-mystic-forge/page';
import { Suspense } from 'react';


export default async function EditMysticForgePage(props: EditMysticForgePageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const outputItemId = Number(params.id);

  return (
    <Modal title={searchParams.recipe ? 'Edit Mystic Forge Recipe' : 'Add Mystic Forge Recipe'}>
      <Suspense fallback={<Skeleton/>}>
        <EditMysticForge outputItemId={outputItemId} recipeId={Array.isArray(searchParams.recipe) ? searchParams.recipe[0] : searchParams.recipe}/>
      </Suspense>
    </Modal>
  );
}

export const metadata = {
  title: 'Edit Mystic Forge'
};
