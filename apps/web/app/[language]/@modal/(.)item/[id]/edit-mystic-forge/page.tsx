import { Modal } from './modal';
import { EditMysticForge } from 'app/[language]/item/[id]/edit-mystic-forge/EditMysticForge';
import type { EditMysticForgePageProps } from 'app/[language]/item/[id]/edit-mystic-forge/page';


export default function EditMysticForgePage({ params, searchParams }: EditMysticForgePageProps) {
  const outputItemId = Number(params.id);

  return (
    <Modal title={searchParams.recipe ? 'Edit Mystic Forge Recipe' : 'Add Mystic Forge Recipe'}>
      <EditMysticForge outputItemId={outputItemId} recipeId={searchParams.recipe}/>
    </Modal>
  );
};

export const metadata = {
  title: 'Edit Mystic Forge'
};
