import { getIconUrl } from '@/lib/getIconUrl';
import { createMetadata } from '@/lib/metadata';
import { parseIcon } from '@/lib/parseIcon';
import { getLanguage } from '@/lib/translate';
import { ChatlinkType, encodeChatlink } from '@gw2/chatlink';
import { strip } from 'gw2-tooltip-html';
import { notFound } from 'next/navigation';
import { ItemPageComponent } from './component';
import { getRevision } from './data';

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
    title: strip(data.name) || encodeChatlink(ChatlinkType.Item, itemId),
    description: strip(data.description) || undefined,
    url: `/item/${id}`,
    image: icon ? { src: getIconUrl(icon, 64), width: 64, height: 64 } : undefined,
  };
});
