import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Modal } from './modal';
import { EditMysticForge } from 'app/[language]/item/[id]/edit-mystic-forge/EditMysticForge';
import type { EditMysticForgePageProps } from 'app/[language]/item/[id]/edit-mystic-forge/page';
import { Suspense } from 'react';
import { createMetadata } from '@/lib/metadata';


export default async function EditMysticForgePage({ params, searchParams }: EditMysticForgePageProps) {
  const { id } = await params;
  const { recipe } = await searchParams;
  const outputItemId = Number(id);

  return (
    <Modal title={recipe ? 'Edit Mystic Forge Recipe' : 'Add Mystic Forge Recipe'}>
      <Suspense fallback={<Skeleton/>}>
        <EditMysticForge outputItemId={outputItemId} recipeId={Array.isArray(recipe) ? recipe[0] : recipe}/>
      </Suspense>
    </Modal>
  );
}

export const generateMetadata = createMetadata({
  title: 'Edit Mystic Forge'
});
