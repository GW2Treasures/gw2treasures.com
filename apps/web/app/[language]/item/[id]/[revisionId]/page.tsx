import { ItemPageComponent } from '../component';
import { getRevision } from '../data';
import { notFound } from 'next/navigation';
import type { PageProps } from '@/lib/next';
import { createMetadata } from '@/lib/metadata';
import { strip } from 'gw2-tooltip-html';
import { encode } from 'gw2e-chat-codes';
import { getLanguage } from '@/lib/translate';

type ItemRevisionPageProps = PageProps<{ id: string, revisionId: string }>;

export default async function ItemPage({ params }: ItemRevisionPageProps) {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const itemId = Number(id);

  return <ItemPageComponent language={language} itemId={itemId} revisionId={revisionId}/>;
}

export const generateMetadata = createMetadata<ItemRevisionPageProps>(async ({ params }) => {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const itemId = Number(id);
  const { data } = await getRevision(itemId, language, revisionId);

  if(!data) {
    notFound();
  }

  return {
    title: `${strip(data.name) || encode('item', itemId) || id} @ ${revisionId}`,
    robots: { index: false }
  };
});
