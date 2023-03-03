import { getLanguage } from '@/components/I18n/getLanguage';
import { ItemPageComponent } from './component';

function ItemPage({ params }: { params: { id: string }}) {
  const language = getLanguage();
  const id: number = Number(params.id);

  /* @ts-expect-error Server Component */
  return <ItemPageComponent language={language} itemId={id}/>;
};

export default ItemPage;
