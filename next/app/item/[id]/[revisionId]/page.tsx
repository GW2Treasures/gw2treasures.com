import { Language } from '@prisma/client';
import { ItemPageComponent } from '../component';

function ItemPage({ params }: { params: { id: string, revisionId: string }}) {
  const locale = 'en'; // TODO
  const id: number = Number(params.id);
  const language = (locale ?? 'en') as Language;

  /* @ts-expect-error Server Component */
  return <ItemPageComponent language={language} itemId={id} revisionId={params.revisionId}/>;
};

export default ItemPage;
