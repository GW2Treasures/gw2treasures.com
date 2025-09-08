import { ItemPageComponent } from './component';
import { getRevision } from './data';
import { notFound } from 'next/navigation';
import { getIconUrl } from '@/lib/getIconUrl';
import { parseIcon } from '@/lib/parseIcon';
import { encode } from 'gw2e-chat-codes';
import { strip } from 'gw2-tooltip-html';
import { createMetadata } from '@/lib/metadata';
import { getLanguage } from '@/lib/translate';

export type ItemPageProps = PageProps<'/[language]/item/[id]'>;

export default async function ItemPage({ params }: ItemPageProps) {
  const language = await getLanguage();
  const { id } = await params;
  const itemId = Number(id);

  return <ItemPageComponent language={language} itemId={itemId}/>;
}

export const generateMetadata = createMetadata<ItemPageProps>(async ({ params }, { language }) => {
  const { id } = await params;
  const itemId = Number(id);
  const { data } = await getRevision(itemId, language);

  if(!data) {
    notFound();
  }

  const icon = parseIcon(data.icon);

  return {
    title: strip(data.name) || encode('item', itemId) || id,
    description: strip(data.description) || undefined,
    url: `/item/${id}`,
    image: icon ? { src: getIconUrl(icon, 64), width: 64, height: 64 } : undefined,
  };
});
