import { Language } from '@gw2treasures/database';
import { ItemPageComponent } from '../component';

function ItemPage({ params: { language, id, revisionId }}: { params: { language: Language, id: string, revisionId: string }}) {
  const itemId: number = Number(id);

  /* @ts-expect-error Server Component */
  return <ItemPageComponent language={language} itemId={itemId} revisionId={revisionId}/>;
};

export default ItemPage;
