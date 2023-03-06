import { Language } from '@prisma/client';
import { ItemPageComponent } from './component';

function ItemPage({ params: { language, id }}: { params: { language: Language, id: string }}) {
  const itemId: number = Number(id);

  /* @ts-expect-error Server Component */
  return <ItemPageComponent language={language} itemId={itemId}/>;
};

export default ItemPage;
