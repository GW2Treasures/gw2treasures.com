import type { Language } from '@gw2treasures/database';
import { ItemPageComponent } from '../component';
import type { Metadata } from 'next';
import { getRevision } from '../data';
import { notFound } from 'next/navigation';

interface ItemRevisionPageProps {
  params: {
    language: Language;
    id: string;
    revisionId: string;
  }
}

export default function ItemPage({ params: { language, id, revisionId }}: ItemRevisionPageProps) {
  const itemId = Number(id);

  return <ItemPageComponent language={language} itemId={itemId} revisionId={revisionId}/>;
};

export async function generateMetadata({ params: { language, id, revisionId }}: ItemRevisionPageProps): Promise<Metadata> {
  const itemId = Number(id);
  const { data } = await getRevision(itemId, language, revisionId);

  if(!data) {
    notFound();
  }

  return {
    title: `${data.name || id} @ ${revisionId}`
  };
};
