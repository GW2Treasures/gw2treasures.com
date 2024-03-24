import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Modal } from './modal';
import { EditMysticForge } from 'app/[language]/item/[id]/edit-mystic-forge/EditMysticForge';
import type { EditMysticForgePageProps } from 'app/[language]/item/[id]/edit-mystic-forge/page';
import { Suspense } from 'react';


export default function EditMysticForgePage({ params, searchParams }: EditMysticForgePageProps) {
  const outputItemId = Number(params.id);

  return (
    <Modal title={searchParams.recipe ? 'Edit Mystic Forge Recipe' : 'Add Mystic Forge Recipe'}>
      <Suspense fallback={<Skeleton/>}>
        <EditMysticForge outputItemId={outputItemId} recipeId={searchParams.recipe}/>
      </Suspense>
    </Modal>
  );
};

export const metadata = {
  title: 'Edit Mystic Forge'
};
