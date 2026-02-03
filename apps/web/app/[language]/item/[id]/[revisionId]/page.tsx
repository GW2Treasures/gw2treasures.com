import { createMetadata } from '@/lib/metadata';
import { getLanguage } from '@/lib/translate';
import { ChatlinkType, encodeChatlink } from '@gw2/chatlink';
import { strip } from 'gw2-tooltip-html';
import { notFound } from 'next/navigation';
import { ItemPageComponent } from '../component';
import { getRevision } from '../data';

export default async function ItemPage({ params }: PageProps<'/[language]/item/[id]/[revisionId]'>) {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const itemId = Number(id);

  return <ItemPageComponent language={language} itemId={itemId} revisionId={revisionId}/>;
}

export const generateMetadata = createMetadata<PageProps<'/[language]/item/[id]/[revisionId]'>>(async ({ params }) => {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const itemId = Number(id);
  const { data } = await getRevision(itemId, language, revisionId);

  if(!data) {
    notFound();
  }

  return {
    title: `${strip(data.name) || encodeChatlink(ChatlinkType.Item, itemId)} @ ${revisionId}`,
    robots: { index: false }
  };
});
