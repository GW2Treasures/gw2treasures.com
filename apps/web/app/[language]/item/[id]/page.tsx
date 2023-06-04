import { Language } from '@gw2treasures/database';
import { ItemPageComponent } from './component';
import { Metadata } from 'next';
import { getRevision } from './data';
import { notFound } from 'next/navigation';

export interface ItemPageProps {
  params: {
    language: Language;
    id: string;
  }
}

export default function ItemPage({ params: { language, id }}: ItemPageProps) {
  const itemId = Number(id);

  return <ItemPageComponent language={language} itemId={itemId}/>;
};

export async function generateMetadata({ params: { language, id }}: ItemPageProps): Promise<Metadata> {
  const itemId = Number(id);
  const { data } = await getRevision(itemId, language);

  if(!data) {
    notFound();
  }

  return {
    title: data.name || id
  };
};
